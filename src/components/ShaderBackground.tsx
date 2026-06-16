/**
 * @file ShaderBackground.tsx
 * @description Advanced fluid organic background simulation written in Pure WebGL.
 * Compiles custom custom Vertex and Fragment shaders dynamically inside the client browser:
 * - Employs a multi-iteration mathematical sine/cosine distortion loop to mimic slow fluid currents.
 * - Interpolates deep space slate backgrounds with glowing primary and secondary energy amber hues.
 * - Automatically registers high-DPI (Retina) device pixel ratio canvas resizing.
 */

import { useEffect, useRef } from "react";

export function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Fallback standard contexts
    const gl =
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl") as WebGLRenderingContext | null;
    if (!gl) return;

    let animationFrameId: number;

    // Standard 2D coordinate projections
    const vs = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Complex trigonometric distortion fragment shader equations matching amber palette color hues
    const fs = `
      precision highp float;
      varying vec2 v_texCoord;
      uniform float u_time;
      uniform vec2 u_resolution;

      void main() {
          vec2 uv = v_texCoord;
          
          // Create organic, slow-moving fluid shapes
          float time = u_time * 0.15;
          
          vec2 p = uv * 2.0 - 1.0;
          p.x *= u_resolution.x / u_resolution.y;
          
          float noise = 0.0;
          vec2 p2 = p;
          for(float i = 1.0; i < 4.0; i++) {
              p2.x += 0.3 / i * sin(i * 3.0 * p2.y + time);
              p2.y += 0.3 / i * cos(i * 3.0 * p2.x + time);
              noise += 0.1 / length(p2);
          }
          
          // Colors derived from Energy Amber system
          vec3 color1 = vec3(0.027, 0.027, 0.039); // #07070A (Deep Black)
          vec3 color2 = vec3(1.0, 0.416, 0.0);   // #FF6A00 (Primary Accent)
          vec3 color3 = vec3(1.0, 0.69, 0.0);    // #FFB000 (Secondary Accent)
          
          // Mix based on organic movement
          float mask = smoothstep(0.1, 0.8, noise * 0.1);
          vec3 finalColor = mix(color1, color2, mask * 0.15);
          finalColor = mix(finalColor, color3, mask * 0.05);
          
          // Vignette
          float vignette = 1.0 - length(p) * 0.5;
          finalColor *= vignette;
          
          gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    function compileShader(type: number, source: string): WebGLShader | null {
      const shader = gl!.createShader(type);
      if (!shader) return null;
      gl!.shaderSource(shader, source);
      gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
        console.error("Shader compilation error:", gl!.getShaderInfoLog(shader));
        gl!.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertexShader = compileShader(gl.VERTEX_SHADER, vs);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fs);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    const vertices = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const uTimeLocation = gl.getUniformLocation(program, "u_time");
    const uResolutionLocation = gl.getUniformLocation(program, "u_resolution");

    function resize() {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth * dpr;
      const height = canvas.clientHeight * dpr;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl!.viewport(0, 0, width, height);
      }
    }

    resize();
    window.addEventListener("resize", resize);

    const startTime = performance.now();

    function render(time: number) {
      if (!gl) return;
      const elapsedSeconds = (time - startTime) * 0.001;

      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);

      if (uTimeLocation) {
        gl.uniform1f(uTimeLocation, elapsedSeconds);
      }
      if (uResolutionLocation) {
        gl.uniform2f(uResolutionLocation, canvas.width, canvas.height);
      }

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    }

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
      if (gl) {
        gl.deleteBuffer(buffer);
        gl.deleteProgram(program);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full z-0 opacity-40 select-none pointer-events-none">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
