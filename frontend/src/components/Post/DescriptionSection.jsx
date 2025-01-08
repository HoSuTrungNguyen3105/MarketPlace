import React from "react";

const DescriptionSection = ({ description }) => {
  return (
    <div className="mt-10" id="description-section">
      <h2 className="text-xl font-semibold mb-4">Mô tả sản phẩm</h2>
      <div className="text-gray-700">
        {description.split("{{newline}}").map((line, index) => (
          <span key={index}>
            {line}
            <br />
          </span>
        ))}
      </div>
    </div>
  );
};

export default DescriptionSection;
