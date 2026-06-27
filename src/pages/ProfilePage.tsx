const onSubmit = async (data: ProfileForm) => {
  setLoading(true);
  setServerMessage(null);

  try {
    // آماده‌سازی json اولیه
    const jsonPayload = {
      username: data.username,
      full_name: data.full_name,
      gender: data.gender,
      birth_date: data.birth_date,
      avatar: data.avatar || null,
    };

    // اگر فایل آواتار انتخاب شده، ابتدا با FormData تلاش کن
    if (avatarFile) {
      const form = new FormData();
      form.append("avatar", avatarFile);
      form.append("username", data.username);
      form.append("full_name", data.full_name);
      form.append("gender", data.gender);
      form.append("birth_date", data.birth_date);

      const res = await fetch(apiBase, {
        method: "PUT",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          // DO NOT set Content-Type for FormData
        },
        body: form,
      });

      if (res.ok) {
        const updated = await res.json();
        setServerMessage("پروفایل با موفقیت بروزرسانی شد.");
        if (updated.full_name) setDisplayNameState(updated.full_name);
        if (updated.avatar) setAvatarPreview(updated.avatar);
        setLoading(false);
        return;
      }

      console.warn("Multipart upload failed, falling back to JSON/dataURL.");
    }

    // fallback: اگر فایل انتخاب شد آن را به dataURL تبدیل کن و در JSON بگذار
    let avatarValue = jsonPayload.avatar;
    if (avatarFile) {
      try {
        const dataUrl = await fileToDataURL(avatarFile);
        avatarValue = dataUrl;
      } catch (e) {
        console.warn("Failed to convert avatar file to data URL", e);
      }
    }

    const res2 = await fetch(apiBase, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ ...jsonPayload, avatar: avatarValue }),
    });

    if (res2.ok) {
      const updated = await res2.json();
      setServerMessage("پروفایل با موفقیت بروزرسانی شد.");
      if (updated.full_name) setDisplayNameState(updated.full_name);
      if (updated.avatar) setAvatarPreview(updated.avatar);
    } else {
      const errJson = await res2.json().catch(() => null);
      setServerMessage(errJson?.detail || "خطا در بروزرسانی پروفایل");
    }
  } catch (err) {
    console.error("Profile update error", err);
    setServerMessage("خطا در ارتباط با سرور هنگام بروزرسانی");
  } finally {
    setLoading(false);
  }
};
