import { useParams } from "react-router-dom";

const CollectionPage = () => {
  // Lấy slug từ URL
  const { categorySlug } = useParams<{ categorySlug: string }>();

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">
        Đang hiển thị danh mục: {categorySlug}
      </h1>
      <p>
        Đây là trang chi tiết cho đường dẫn: https://wolf-bed.mysapo.net/
        {categorySlug}
      </p>
      {/* Tại đây bạn có thể gọi API dựa vào categorySlug để lấy sản phẩm cụ thể */}
    </div>
  );
};

export default CollectionPage;
