import React, { useMemo } from "react";

const ProductDetails = ({ category, dynamicFields, onFieldChange }) => {
  const categoryFields = useMemo(
    () => ({
      1: [
        {
          name: "brand",
          label: "Hãng sản xuất",
          type: "text",
          placeholder: "Nhập hãng sản xuất",
        },
        {
          name: "warranty",
          label: "Bảo hành (tháng)",
          type: "number",
          placeholder: "Nhập số tháng",
        },
      ],
      2: [
        {
          name: "material",
          label: "Chất liệu",
          type: "text",
          placeholder: "Nhập chất liệu",
        },
        {
          name: "size",
          label: "Kích thước",
          type: "text",
          placeholder: "Nhập kích thước",
        },
      ],
      3: [
        {
          name: "brand",
          label: "Thương hiệu",
          type: "text",
          placeholder: "Nhập thương hiệu",
        },
        {
          name: "size",
          label: "Kích cỡ",
          type: "text",
          placeholder: "Nhập kích cỡ",
        },
        {
          name: "gender",
          label: "Dành cho giới tính",
          type: "text",
          placeholder: "Nam/Nữ/Unisex",
        },
      ],
      4: [
        {
          name: "expirationDate",
          label: "Hạn sử dụng",
          type: "date",
          placeholder: "Chọn ngày hết hạn",
        },
        {
          name: "origin",
          label: "Xuất xứ",
          type: "text",
          placeholder: "Nhập nơi sản xuất",
        },
      ],
      5: [
        {
          name: "brand",
          label: "Thương hiệu",
          type: "text",
          placeholder: "Nhập thương hiệu",
        },
        {
          name: "quantity",
          label: "Số lượng",
          type: "number",
          placeholder: "Nhập số lượng",
        },
      ],
      6: [
        {
          name: "species",
          label: "Loài thú cưng",
          type: "text",
          placeholder: "Nhập loài thú cưng",
        },
        {
          name: "age",
          label: "Tuổi",
          type: "number",
          placeholder: "Nhập tuổi",
        },
      ],
      7: [
        {
          name: "platform",
          label: "Hệ máy",
          type: "text",
          placeholder: "Nhập hệ máy (PlayStation, Xbox, PC...)",
        },
        {
          name: "type",
          label: "Loại sản phẩm",
          type: "text",
          placeholder: "Nhập loại (đồ chơi, đồ sưu tầm...)",
        },
      ],
      8: [
        {
          name: "sportType",
          label: "Loại thể thao",
          type: "text",
          placeholder: "Nhập loại thể thao (bóng đá, cầu lông...)",
        },
        {
          name: "brand",
          label: "Thương hiệu",
          type: "text",
          placeholder: "Nhập thương hiệu",
        },
      ],
      9: [
        {
          name: "personalItemType",
          label: "Loại đồ dùng cá nhân",
          type: "text",
          placeholder: "Nhập loại đồ dùng cá nhân",
        },
        {
          name: "material",
          label: "Chất liệu",
          type: "text",
          placeholder: "Nhập chất liệu",
        },
      ],
      10: [
        {
          name: "destination",
          label: "Điểm đến",
          type: "text",
          placeholder: "Nhập điểm đến",
        },
        {
          name: "travelDuration",
          label: "Thời gian (ngày)",
          type: "number",
          placeholder: "Nhập số ngày",
        },
      ],
    }),
    []
  );

  const fields = categoryFields[category] || [];

  return (
    <div className="product-details-form space-y-4">
      {fields.map((field) => (
        <div key={field.name} className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            {field.label}
          </label>
          <input
            type={field.type}
            name={field.name}
            placeholder={field.placeholder}
            value={dynamicFields[field.name] || ""}
            onChange={onFieldChange}
            className="input input-bordered w-full p-3 rounded-md"
          />
        </div>
      ))}
    </div>
  );
};

export default ProductDetails;
