import { useAuth } from "@clerk/clerk-react";
import { Images } from "lucide-react";
import { useState, useEffect } from "react";

interface SliderImage {
  public_id: string;
  secure_url: string;
  title?: string;
}

function AdminSliderUpload() {
  const { getToken } = useAuth();

  // const getAuthHeader = async () => {
  //   const token = await getToken({ template: "my-backend" });
  //   return token ? { Authorization: `Bearer ${token}` } : {};
  // };
  const getAuthHeader = async (): Promise<Record<string, string>> => {
    const token = await getToken({ template: "my-backend" });
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"slider" | "flashsale">("slider");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [images, setImages] = useState<SliderImage[]>([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Load danh sách ảnh theo folder (slider hoặc flashsale)
  const loadImages = async () => {
    setLoadingImages(true);
    setMessage("");

    try {
      const authHeader = await getAuthHeader();
      const res = await fetch(
        `http://localhost:8081/api/admin/sliders/list?folder=${type}&max=50`,
        {
          cache: "no-store",
          headers: { "Content-Type": "application/json", ...authHeader },
        },
      );

      if (!res.ok) throw new Error("Không tải được danh sách ảnh");

      const data = await res.json();
      const resources = data.resources || [];

      const mappedImages: SliderImage[] = resources.map((r: any) => ({
        public_id: r.public_id,
        secure_url: r.secure_url,
        title: r.context?.title || "",
      }));

      setImages(mappedImages);
    } catch (err: any) {
      console.error("Lỗi tải ảnh:", err);
      setMessage("Không tải được danh sách ảnh");
    } finally {
      setLoadingImages(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, [type]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    const authHeader = await getAuthHeader();
    if (!file) {
      setMessage("Vui lòng chọn ảnh!");
      return;
    }

    setUploading(true);
    setMessage("");

    try {
      const signRes = await fetch(
        "http://localhost:8081/api/admin/sliders/sign",
        {
          method: "POST",
          headers: { "Content-Type": "application/json", ...authHeader },
          body: JSON.stringify({
            folder: type,
            title: type === "slider" && title.trim() ? title.trim() : undefined,
          }),
        },
      );

      if (!signRes.ok) throw new Error("Lấy signature thất bại");

      const { timestamp, signature, cloudName, apiKey, folder, context } =
        await signRes.json();

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp.toString());
      formData.append("signature", signature);
      formData.append("folder", folder);

      if (context) {
        formData.append("context", context);
      }

      const cloudinaryRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await cloudinaryRes.json();

      if (cloudinaryRes.ok) {
        setMessage(`Upload thành công! ${data.original_filename}`);
        loadImages();
        setFile(null);
        setTitle("");
      } else {
        setMessage(`Upload lỗi: ${data.error?.message || "Unknown error"}`);
      }
    } catch (err: any) {
      setMessage(`Lỗi: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (publicId: string) => {
    if (!confirm("Bạn có chắc muốn xóa ảnh này?")) return;

    setDeleting(publicId);
    const authHeader = await getAuthHeader();

    try {
      const res = await fetch(
        "http://localhost:8081/api/admin/sliders/delete",
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json", ...authHeader },
          body: JSON.stringify({ publicId }),
        },
      );

      if (res.ok) {
        setMessage("Xóa ảnh thành công!");
        loadImages();
      } else {
        const errData = await res.json();
        setMessage(`Xóa thất bại: ${errData.error || "Unknown error"}`);
      }
    } catch (err: any) {
      setMessage(`Lỗi khi xóa: ${err.message}`);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <Images className="text-emerald-600" size={36} />
        Quản lý Slider
      </h1>

      {/* Chọn loại banner */}
      <div className="mb-8">
        <label className="block text-lg font-medium mb-2">Loại banner:</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as "slider" | "flashsale")}
          className="w-full md:w-64 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={uploading}
        >
          <option value="slider">Slider Trang Chủ</option>
          <option value="flashsale">Banner Flashsale</option>
        </select>
      </div>

      {/* Upload area */}
      <div className="mb-10 p-6 border rounded-lg bg-gray-50">
        <h3 className="text-xl font-semibold mb-4">
          Upload {type === "slider" ? "ảnh Slider" : "banner Flashsale"}
        </h3>

        {type === "slider" && (
          <input
            type="text"
            placeholder="Nhập slogan / title cho ảnh (tùy chọn)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mb-4 block w-full rounded-md border px-3 py-2 text-sm"
            disabled={uploading}
          />
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-4 block w-full text-sm"
          disabled={uploading}
        />

        <button
          onClick={handleUpload}
          disabled={uploading || !file}
          className={`px-6 py-2 rounded-lg text-white ${
            uploading || !file
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {uploading ? "Đang upload..." : "Upload"}
        </button>

        {message && (
          <p className="mt-4 text-center font-medium text-red-600">{message}</p>
        )}
      </div>

      {/* Danh sách ảnh */}
      <div>
        <h3 className="text-xl font-semibold mb-4">
          {type === "slider" ? "Ảnh Slider" : "Banner Flashsale"} hiện tại (
          {images.length})
        </h3>

        {type === "flashsale" && (
          <p className="text-sm text-blue-600 mb-4 bg-blue-50 p-3 rounded">
            Trang Flashsale sẽ tự động hiển thị{" "}
            <strong>ảnh upload mới nhất</strong> trong folder này.
          </p>
        )}

        {loadingImages ? (
          <p className="text-center py-8">Đang tải...</p>
        ) : images.length === 0 ? (
          <p className="text-center py-8 text-gray-500">
            Chưa có ảnh nào trong folder {type}
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((img) => (
              <div
                key={img.public_id}
                className="relative group cursor-pointer rounded overflow-hidden shadow hover:shadow-lg transition-shadow"
                onClick={() => handleDelete(img.public_id)}
              >
                <img
                  src={img.secure_url}
                  alt={img.title || "banner"}
                  className="w-full h-40 object-cover"
                />

                {/* Hiển thị slogan nếu có - nền đen chữ trắng, nằm trong ảnh ở đáy */}
                {img?.title && (
                  <div
                    className="
      absolute bottom-0 left-0 right-0
      bg-gradient-to-t from-black/80 via-black/50 to-transparent
      backdrop-blur-[2px]
      text-white
      text-sm md:text-base lg:text-lg
      font-semibold
      px-4 py-3
      flex items-end
      rounded-b
    "
                  >
                    <span className="drop-shadow-md tracking-wide">
                      {img.title}
                    </span>
                  </div>
                )}

                {/* Overlay xóa */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 transition-opacity">
                  {/* Nút Xem */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(img.secure_url, "_blank");
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded font-semibold shadow"
                    // className="bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded font-semibold shadow"
                    // className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded font-semibold shadow"
                  >
                    Xem
                  </button>

                  {/* Nút Xóa */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(img.public_id);
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold shadow"
                  >
                    {deleting === img.public_id ? "Đang xóa..." : "Xóa"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminSliderUpload;
