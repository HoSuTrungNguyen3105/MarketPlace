import React, { useMemo, useState } from "react";

const ProductDetails = ({ category, dynamicFields, onFieldChange }) => {
  const [otherValue, setOtherValue] = useState(""); // State để lưu giá trị nhập "Khác"

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
        {
          name: "color",
          label: "Màu sắc",
          type: "text",
          placeholder: "Nhập màu sắc",
        },
        {
          name: "origin",
          label: "Xuất xứ",
          type: "text",
          placeholder: "Nhập nơi xuất xứ",
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
        {
          name: "weight",
          label: "Trọng lượng",
          type: "number",
          placeholder: "Nhập trọng lượng (kg)",
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
          type: "select",
          options: ["Nam", "Nữ", "Unisex", "Trẻ em", "Khác"], // Thêm "Trẻ em"
        },
        {
          name: "color",
          label: "Màu sắc",
          type: "text",
          placeholder: "Nhập màu sắc",
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
        {
          name: "storageInstructions",
          label: "Hướng dẫn bảo quản",
          type: "text",
          placeholder: "Nhập hướng dẫn bảo quản",
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
        {
          name: "unit",
          label: "Đơn vị",
          type: "select",
          options: ["Hộp", "Chai", "Gói", "Cuộn", "Túi", "Khác"], // Thêm "Cuộn", "Túi"
        },
      ],
      6: [
        {
          name: "species",
          label: "Loài thú cưng",
          type: "select",
          options: [
            "Chó",
            "Mèo",
            "Chim",
            "Cá",
            "Hamster",
            "Thỏ",
            "Rùa",
            "Vẹt",
            "Chuột lang",
            "Khác",
          ], // Thêm "Vẹt", "Chuột lang"
        },
        {
          name: "age",
          label: "Tuổi",
          type: "number",
          placeholder: "Nhập tuổi",
        },
        {
          name: "weight",
          label: "Cân nặng",
          type: "number",
          placeholder: "Nhập cân nặng (kg)",
        },
      ],
      7: [
        {
          name: "platform",
          label: "Hệ máy",
          type: "select",
          options: ["PlayStation", "Xbox", "PC", "Khác"],
        },
        {
          name: "type",
          label: "Loại sản phẩm",
          type: "select",
          options: [
            "Đồ chơi",
            "Đồ chơi người lớn",
            "Đồ sưu tầm",
            "Đồ cổ",
            "Khác",
          ], // Thêm "Đồ cổ"
        },
        {
          name: "releaseYear",
          label: "Năm phát hành",
          type: "number",
          placeholder: "Nhập năm phát hành",
        },
      ],
      8: [
        {
          name: "sportType",
          label: "Loại thể thao",
          type: "select",
          options: [
            "Bóng đá",
            "Cầu lông",
            "Bóng bàn",
            "Yoga",
            "Chạy bộ",
            "Khác",
          ], // Thêm "Yoga", "Chạy bộ"
        },
        {
          name: "brand",
          label: "Thương hiệu",
          type: "text",
          placeholder: "Nhập thương hiệu",
        },
        {
          name: "intendedFor",
          label: "Đối tượng sử dụng",
          type: "select",
          options: ["Trẻ em", "Người lớn", "Vận động viên", "Khác"],
        },
      ],
      9: [
        {
          name: "personalItemType",
          label: "Loại đồ dùng cá nhân",
          type: "select",
          options: ["Bút", "Sách/Vở", "Thước", "Balo", "Kính mắt", "Khác"], // Thêm "Balo", "Kính mắt"
        },
        {
          name: "material",
          label: "Chất liệu",
          type: "text",
          placeholder: "Nhập chất liệu",
        },
        {
          name: "brand",
          label: "Thương hiệu",
          type: "text",
          placeholder: "Nhập thương hiệu",
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
          type: "date",
          placeholder: "Nhập số ngày",
        },
        {
          name: "travelType",
          label: "Loại hình du lịch",
          type: "select",
          options: ["Nghỉ dưỡng", "Khám phá", "Mạo hiểm", "Khác"], // Thêm "Mạo hiểm"
        },
      ],
    }),
    []
  );

  const handleSelectChange = (e) => {
    const { name, value } = e.target;

    // Nếu người dùng chọn "Khác", hãy hiển thị trường nhập liệu
    if (value === "Khác") {
      setOtherValue(""); // Reset giá trị khi chọn "Khác"
    }

    // Gọi hàm xử lý thay đổi trường thông qua onFieldChange
    onFieldChange(e);
  };

  const handleOtherValueChange = (e) => {
    setOtherValue(e.target.value); // Cập nhật giá trị cho trường "Khác"
    onFieldChange({ target: { name: "other", value: e.target.value } });
  };

  const fields = categoryFields[category] || [];
  return (
    <div className="product-details-form space-y-4">
      {fields.map((field) => (
        <div key={field.name} className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            {field.label}
          </label>
          {field.type === "select" ? (
            <div>
              <select
                name={field.name}
                value={dynamicFields[field.name] || ""}
                onChange={handleSelectChange}
                className="w-full p-4 bg-white bg-opacity-20  rounded-lg shadow-inner focus:ring-2 focus:ring-purple-300 focus:bg-opacity-30 transition-all duration-300 placeholder-gray-300"
              >
                <option value="">Chọn {field.label}</option>
                {field.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {/* Hiển thị trường nhập khi chọn "Khác" */}
              {dynamicFields[field.name] === "Khác" && (
                <input
                  type="text"
                  value={otherValue}
                  onChange={handleOtherValueChange}
                  placeholder="Vui lòng nhập thông tin"
                  className="w-full p-4 bg-white bg-opacity-20  rounded-lg shadow-inner focus:ring-2 focus:ring-purple-300 focus:bg-opacity-30 transition-all duration-300 placeholder-gray-300"
                />
              )}
            </div>
          ) : (
            <input
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
              value={dynamicFields[field.name] || ""}
              onChange={onFieldChange}
              className="w-full p-4 bg-white bg-opacity-20  rounded-lg shadow-inner focus:ring-2 focus:ring-purple-300 focus:bg-opacity-30 transition-all duration-300 placeholder-gray-300"
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductDetails;
