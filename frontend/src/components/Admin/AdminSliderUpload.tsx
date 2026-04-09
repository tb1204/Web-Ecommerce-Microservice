// // import { useAuth } from "@clerk/clerk-react";
// // import { Images } from "lucide-react";
// // import { useState, useEffect } from "react";

// // interface SliderImage {
// //   public_id: string;
// //   secure_url: string;
// //   title?: string;
// // }

// // function AdminSliderUpload() {
// //   const BASE_URL = "http://localhost:8081";
// //   const { getToken } = useAuth();

// //   // const getAuthHeader = async () => {
// //   //   const token = await getToken({ template: "my-backend" });
// //   //   return token ? { Authorization: `Bearer ${token}` } : {};
// //   // };
// //   const getAuthHeader = async (): Promise<Record<string, string>> => {
// //     const token = await getToken({ template: "my-backend" });
// //     return token ? { Authorization: `Bearer ${token}` } : {};
// //   };

// //   const [file, setFile] = useState<File | null>(null);
// //   const [title, setTitle] = useState("");
// //   const [type, setType] = useState<"slider" | "flashsale">("slider");
// //   const [uploading, setUploading] = useState(false);
// //   const [message, setMessage] = useState("");
// //   const [images, setImages] = useState<SliderImage[]>([]);
// //   const [loadingImages, setLoadingImages] = useState(true);
// //   const [deleting, setDeleting] = useState<string | null>(null);

// //   // Load danh sách ảnh theo folder (slider hoặc flashsale)
// //   const loadImages = async () => {
// //     setLoadingImages(true);
// //     setMessage("");

// //     try {
// //       const authHeader = await getAuthHeader();
// //       const res = await fetch(
// //         `${BASE_URL}/api/admin/sliders/list?folder=${type}&max=50`,
// //         {
// //           cache: "no-store",
// //           headers: { "Content-Type": "application/json", ...authHeader },
// //         },
// //       );

// //       if (!res.ok) throw new Error("Không tải được danh sách ảnh");

// //       const data = await res.json();
// //       const resources = data.resources || [];

// //       const mappedImages: SliderImage[] = resources.map((r: any) => ({
// //         public_id: r.public_id,
// //         secure_url: r.secure_url,
// //         title: r.context?.title || "",
// //       }));

// //       setImages(mappedImages);
// //     } catch (err: any) {
// //       console.error("Lỗi tải ảnh:", err);
// //       setMessage("Không tải được danh sách ảnh");
// //     } finally {
// //       setLoadingImages(false);
// //     }
// //   };

// //   useEffect(() => {
// //     loadImages();
// //   }, [type]);

// //   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     if (e.target.files && e.target.files[0]) {
// //       setFile(e.target.files[0]);
// //     }
// //   };

// //   const handleUpload = async () => {
// //     const authHeader = await getAuthHeader();
// //     if (!file) {
// //       setMessage("Vui lòng chọn ảnh!");
// //       return;
// //     }

// //     setUploading(true);
// //     setMessage("");

// //     try {
// //       const signRes = await fetch(`${BASE_URL}/api/admin/sliders/sign`, {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json", ...authHeader },
// //         body: JSON.stringify({
// //           folder: type,
// //           title: type === "slider" && title.trim() ? title.trim() : undefined,
// //         }),
// //       });

// //       if (!signRes.ok) throw new Error("Lấy signature thất bại");

// //       const { timestamp, signature, cloudName, apiKey, folder, context } =
// //         await signRes.json();

// //       const formData = new FormData();
// //       formData.append("file", file);
// //       formData.append("api_key", apiKey);
// //       formData.append("timestamp", timestamp.toString());
// //       formData.append("signature", signature);
// //       formData.append("folder", folder);

// //       if (context) {
// //         formData.append("context", context);
// //       }

// //       const cloudinaryRes = await fetch(
// //         `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
// //         {
// //           method: "POST",
// //           body: formData,
// //         },
// //       );

// //       const data = await cloudinaryRes.json();

// //       if (cloudinaryRes.ok) {
// //         setMessage(`Upload thành công! ${data.original_filename}`);
// //         loadImages();
// //         setFile(null);
// //         setTitle("");
// //       } else {
// //         setMessage(`Upload lỗi: ${data.error?.message || "Unknown error"}`);
// //       }
// //     } catch (err: any) {
// //       setMessage(`Lỗi: ${err.message}`);
// //     } finally {
// //       setUploading(false);
// //     }
// //   };

// //   const handleDelete = async (publicId: string) => {
// //     if (!confirm("Bạn có chắc muốn xóa ảnh này?")) return;

// //     setDeleting(publicId);
// //     const authHeader = await getAuthHeader();

// //     try {
// //       const res = await fetch(`${BASE_URL}/api/admin/sliders/delete`, {
// //         method: "DELETE",
// //         headers: { "Content-Type": "application/json", ...authHeader },
// //         body: JSON.stringify({ publicId }),
// //       });

// //       if (res.ok) {
// //         setMessage("Xóa ảnh thành công!");
// //         loadImages();
// //       } else {
// //         const errData = await res.json();
// //         setMessage(`Xóa thất bại: ${errData.error || "Unknown error"}`);
// //       }
// //     } catch (err: any) {
// //       setMessage(`Lỗi khi xóa: ${err.message}`);
// //     } finally {
// //       setDeleting(null);
// //     }
// //   };

// //   return (
// //     <div className="p-6 bg-white rounded-lg shadow-lg max-w-5xl mx-auto">
// //       <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
// //         <Images className="text-emerald-600" size={36} />
// //         Quản lý Slider
// //       </h1>

// //       {/* Chọn loại banner */}
// //       <div className="mb-8">
// //         <label className="block text-lg font-medium mb-2">Loại banner:</label>
// //         <select
// //           value={type}
// //           onChange={(e) => setType(e.target.value as "slider" | "flashsale")}
// //           className="w-full md:w-64 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
// //           disabled={uploading}
// //         >
// //           <option value="slider">Slider Trang Chủ</option>
// //           <option value="flashsale">Banner Flashsale</option>
// //         </select>
// //       </div>

// //       {/* Upload area */}
// //       <div className="mb-10 p-6 border rounded-lg bg-gray-50">
// //         <h3 className="text-xl font-semibold mb-4">
// //           Upload {type === "slider" ? "ảnh Slider" : "banner Flashsale"}
// //         </h3>

// //         {type === "slider" && (
// //           <input
// //             type="text"
// //             placeholder="Nhập slogan / title cho ảnh (tùy chọn)"
// //             value={title}
// //             onChange={(e) => setTitle(e.target.value)}
// //             className="mb-4 block w-full rounded-md border px-3 py-2 text-sm"
// //             disabled={uploading}
// //           />
// //         )}

// //         <input
// //           type="file"
// //           accept="image/*"
// //           onChange={handleFileChange}
// //           className="mb-4 block w-full text-sm"
// //           disabled={uploading}
// //         />

// //         <button
// //           onClick={handleUpload}
// //           disabled={uploading || !file}
// //           className={`px-6 py-2 rounded-lg text-white ${
// //             uploading || !file
// //               ? "bg-gray-400 cursor-not-allowed"
// //               : "bg-blue-600 hover:bg-blue-700"
// //           }`}
// //         >
// //           {uploading ? "Đang upload..." : "Upload"}
// //         </button>

// //         {message && (
// //           <p className="mt-4 text-center font-medium text-red-600">{message}</p>
// //         )}
// //       </div>

// //       {/* Danh sách ảnh */}
// //       <div>
// //         <h3 className="text-xl font-semibold mb-4">
// //           {type === "slider" ? "Ảnh Slider" : "Banner Flashsale"} hiện tại (
// //           {images.length})
// //         </h3>

// //         {type === "flashsale" && (
// //           <p className="text-sm text-blue-600 mb-4 bg-blue-50 p-3 rounded">
// //             Trang Flashsale sẽ tự động hiển thị{" "}
// //             <strong>ảnh upload mới nhất</strong> trong folder này.
// //           </p>
// //         )}

// //         {loadingImages ? (
// //           <p className="text-center py-8">Đang tải...</p>
// //         ) : images.length === 0 ? (
// //           <p className="text-center py-8 text-gray-500">
// //             Chưa có ảnh nào trong folder {type}
// //           </p>
// //         ) : (
// //           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
// //             {images.map((img) => (
// //               <div
// //                 key={img.public_id}
// //                 className="relative group cursor-pointer rounded overflow-hidden shadow hover:shadow-lg transition-shadow"
// //                 onClick={() => handleDelete(img.public_id)}
// //               >
// //                 <img
// //                   src={img.secure_url}
// //                   alt={img.title || "banner"}
// //                   className="w-full h-40 object-cover"
// //                 />

// //                 {/* Hiển thị slogan nếu có - nền đen chữ trắng, nằm trong ảnh ở đáy */}
// //                 {img?.title && (
// //                   <div
// //                     className="
// //       absolute bottom-0 left-0 right-0
// //       bg-gradient-to-t from-black/80 via-black/50 to-transparent
// //       backdrop-blur-[2px]
// //       text-white
// //       text-sm md:text-base lg:text-lg
// //       font-semibold
// //       px-4 py-3
// //       flex items-end
// //       rounded-b
// //     "
// //                   >
// //                     <span className="drop-shadow-md tracking-wide">
// //                       {img.title}
// //                     </span>
// //                   </div>
// //                 )}

// //                 {/* Overlay xóa */}
// //                 <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 transition-opacity">
// //                   {/* Nút Xem */}
// //                   <button
// //                     onClick={(e) => {
// //                       e.stopPropagation();
// //                       window.open(img.secure_url, "_blank");
// //                     }}
// //                     className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded font-semibold shadow"
// //                     // className="bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded font-semibold shadow"
// //                     // className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded font-semibold shadow"
// //                   >
// //                     Xem
// //                   </button>

// //                   {/* Nút Xóa */}
// //                   <button
// //                     onClick={(e) => {
// //                       e.stopPropagation();
// //                       handleDelete(img.public_id);
// //                     }}
// //                     className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold shadow"
// //                   >
// //                     {deleting === img.public_id ? "Đang xóa..." : "Xóa"}
// //                   </button>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// // export default AdminSliderUpload;

//test chức năng kéo thả
import {
  Images,
  Upload,
  Trash2,
  ExternalLink,
  Info,
  Loader2,
  ImagePlus,
  FileWarning,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";

interface SliderImage {
  public_id: string;
  secure_url: string;
  title?: string;
}

function AdminSliderUpload() {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { getToken } = useAuth();

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

  // State xử lý UI kéo thả
  const [isDragging, setIsDragging] = useState(false);

  const loadImages = async () => {
    setLoadingImages(true);
    setMessage("");
    try {
      const authHeader = await getAuthHeader();
      // Trong môi trường thật, đây là API backend của bạn
      const res = await fetch(
        `${BASE_URL}/api/admin/sliders/list?folder=${type}&max=50`,
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

      // setImages([
      //   {
      //     public_id: "1",
      //     secure_url:
      //       "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800",
      //     title: "Summer Sale",
      //   },
      //   {
      //     public_id: "2",
      //     secure_url:
      //       "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
      //     title: "Flash Sale Banner",
      //   },
      // ]);
    } finally {
      setLoadingImages(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, [type]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type.startsWith("image/")) {
        setFile(selectedFile);
        setMessage("");
      } else {
        setFile(null);
        setMessage("Lỗi: Chỉ được phép chọn tập tin hình ảnh!");
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!uploading) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (uploading) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];

      if (droppedFile.type.startsWith("image/")) {
        setFile(droppedFile);
        setMessage("");
      } else {
        setFile(null);
        setMessage(
          "Lỗi: Bạn đã kéo thả sai định dạng. Vui lòng chỉ sử dụng ảnh!",
        );
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Vui lòng chọn ảnh!");
      return;
    }
    setUploading(true);
    setMessage("");
    try {
      const authHeader = await getAuthHeader();
      const signRes = await fetch(`${BASE_URL}/api/admin/sliders/sign`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader },
        body: JSON.stringify({
          folder: type,
          title: type === "slider" && title.trim() ? title.trim() : undefined,
        }),
      });
      if (!signRes.ok) throw new Error("Lấy signature thất bại");
      const { timestamp, signature, cloudName, apiKey, folder, context } =
        await signRes.json();
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp.toString());
      formData.append("signature", signature);
      formData.append("folder", folder);
      if (context) formData.append("context", context);

      const cloudinaryRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );
      const data = await cloudinaryRes.json();
      if (cloudinaryRes.ok) {
        setMessage(`Upload thành công!`);
        loadImages();
        setFile(null);
        setTitle("");
      } else {
        setMessage(`Upload lỗi: ${data.error?.message || "Unknown error"}`);
      }
    } catch (err: any) {
      setMessage(
        `Lỗi: ${err.message}. (Gợi ý: Kiểm tra server backend localhost:8081)`,
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (publicId: string) => {
    if (!confirm("Bạn có chắc muốn xóa ảnh này?")) return;
    setDeleting(publicId);
    const authHeader = await getAuthHeader();
    try {
      const res = await fetch(`${BASE_URL}/api/admin/sliders/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", ...authHeader },
        body: JSON.stringify({ publicId }),
      });
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
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 rounded-xl">
              <Images className="text-emerald-600" size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Quản lý Media
              </h1>
              <p className="text-gray-500 text-sm">
                Cập nhật ảnh Slider và Flashsale cho trang chủ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-600 whitespace-nowrap">
              Hiển thị:
            </span>
            <select
              value={type}
              onChange={(e) =>
                setType(e.target.value as "slider" | "flashsale")
              }
              className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 outline-none transition-all"
              disabled={uploading}
            >
              <option value="slider">Slider Trang Chủ</option>
              <option value="flashsale">Banner Flashsale</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Column */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-6">
              <div className="flex items-center gap-2 mb-6">
                <ImagePlus size={20} className="text-blue-600" />
                <h3 className="font-bold text-gray-800 uppercase tracking-wider text-sm">
                  Thêm mới {type === "slider" ? "Slider" : "Banner"}
                </h3>
              </div>

              <div className="space-y-4">
                {type === "slider" && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1 ml-1">
                      Slogan ảnh
                    </label>
                    <input
                      type="text"
                      placeholder="VD: Giảm giá mùa hè 50%..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                      disabled={uploading}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1 ml-1">
                    Kéo thả ảnh duy nhất vào khung
                  </label>
                  <label
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`
                      relative flex flex-col items-center justify-center w-full min-h-[160px] border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200
                      ${isDragging ? "border-blue-500 bg-blue-50 scale-[1.02]" : ""}
                      ${file ? "border-emerald-400 bg-emerald-50" : "border-gray-300 bg-gray-50 hover:bg-gray-100"}
                      ${uploading ? "opacity-50 cursor-not-allowed" : ""}
                    `}
                  >
                    <div className="flex flex-col items-center justify-center p-6 text-center pointer-events-none">
                      {isDragging ? (
                        <>
                          <Upload
                            className="mb-2 text-blue-500 animate-bounce"
                            size={32}
                          />
                          <p className="text-sm font-bold text-blue-600">
                            Thả ảnh vào đây!
                          </p>
                        </>
                      ) : file ? (
                        <>
                          <div className="relative w-full aspect-video mb-3 rounded-lg overflow-hidden border border-emerald-200 bg-white shadow-inner">
                            <img
                              src={URL.createObjectURL(file)}
                              alt="Preview"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <p className="text-xs font-medium text-emerald-600 truncate max-w-[200px]">
                            {file.name}
                          </p>
                          <p className="text-[10px] text-gray-400 uppercase mt-1">
                            Click để thay đổi
                          </p>
                        </>
                      ) : (
                        <>
                          <Upload className="mb-2 text-gray-400" size={32} />
                          <p className="text-sm text-gray-500 font-medium">
                            Click để chọn hoặc kéo thả ảnh
                          </p>
                          <p className="text-[10px] text-gray-400 mt-1 uppercase">
                            JPG, PNG, WEBP
                          </p>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                </div>

                <button
                  onClick={handleUpload}
                  disabled={uploading || !file}
                  className={`
                    w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm
                    ${
                      uploading || !file
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.98]"
                    }
                  `}
                >
                  {uploading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Upload size={18} />
                  )}
                  {uploading ? "Đang xử lý..." : "Bắt đầu Upload"}
                </button>

                {message && (
                  <div
                    className={`p-3 rounded-lg text-xs font-medium flex items-start gap-2 animate-in fade-in slide-in-from-top-2 ${
                      message.includes("thành công")
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700 border border-red-200"
                    }`}
                  >
                    {message.includes("Lỗi") ? (
                      <FileWarning size={16} className="mt-0.5 shrink-0" />
                    ) : (
                      <Info size={16} className="mt-0.5 shrink-0" />
                    )}
                    <span className="flex-1">{message}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* List Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[500px]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-800 uppercase tracking-wider text-sm">
                    Danh sách hiện có
                  </h3>
                  <h3 className="px-2 py-0.5  bg-emerald-500 text-white shadow-red-200 rounded-full text-xs font-bold">
                    {images.length}
                  </h3>
                </div>
              </div>

              {loadingImages ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  <div className="w-10 h-10 animate-spin rounded-full border-b-2 border-emerald-600 mx-auto mb-2"></div>
                  <p className="mt-4 text-gray-400 text-[10px] font-black uppercase tracking-[3px]">
                    Đang tải ...
                  </p>
                </div>
              ) : images.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400 border-2 border-dashed border-gray-100 rounded-2xl">
                  <Images size={48} className="mb-4 opacity-20" />
                  <p className="text-sm">Chưa có hình ảnh nào được tải lên</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {images.map((img) => (
                    <div
                      key={img.public_id}
                      className="group relative bg-gray-50 rounded-xl overflow-hidden border border-gray-100 transition-all hover:shadow-md"
                    >
                      <div className="aspect-video w-full overflow-hidden bg-gray-200">
                        <img
                          src={img.secure_url}
                          alt={img.title || "banner"}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>

                      <div className="p-3 bg-white">
                        <p className="text-xs font-semibold text-gray-800 truncate">
                          {img.title || "Không có tiêu đề"}
                        </p>
                        <p className="text-[10px] text-gray-400 truncate font-mono mt-1">
                          ID: {img.public_id}
                        </p>
                      </div>

                      <div className="absolute inset-0 bg-gray-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(img.secure_url, "_blank");
                          }}
                          className="p-2.5 bg-white/20 hover:bg-white/40 text-white rounded-full transition-colors"
                        >
                          <ExternalLink size={20} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(img.public_id);
                          }}
                          disabled={deleting === img.public_id}
                          className="p-2.5 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all"
                        >
                          {deleting === img.public_id ? (
                            <Loader2 className="animate-spin" size={20} />
                          ) : (
                            <Trash2 size={20} />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminSliderUpload;
