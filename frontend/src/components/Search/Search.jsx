import React from "react";
import Posts from "../Post/Posts";

const Search = () => {
  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-3xl font-bold mb-8">Danh sách sản phẩm</h1>

      {/* Bộ lọc */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-3">
          <div className="mb-6">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full p-3 border rounded-lg"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-bold">Trạng thái giá</label>
            <select className="w-full p-3 border rounded-lg">
              <option>Tất cả</option>
              <option>Giảm giá</option>
              <option>Không giảm giá</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-bold">Sắp xếp</label>
            <select className="w-full p-3 border rounded-lg">
              <option>Mới nhất</option>
              <option>Giá tăng dần</option>
              <option>Giá giảm dần</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-bold">Thương hiệu</label>
            <div className="space-y-2">
              {["Wilson", "Babolat", "Head", "Yonex", "Prince", "Dunlop"].map(
                (brand) => (
                  <div key={brand} className="flex items-center">
                    <input type="checkbox" id={brand} className="mr-2" />
                    <label htmlFor={brand}>{brand}</label>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Danh sách sản phẩm */}
        <div className="col-span-9 grid grid-cols-3 gap-6">
          {[
            {
              id: 1,
              brand: "Babolat",
              name: "Babolat Pure Aero",
              price: "219.999đ",
              originalPrice: "229.999đ",
              discount: "-4%",
              rating: 4.5,
              reviews: 4,
              image: "https://via.placeholder.com/150",
            },
            {
              id: 2,
              brand: "Wilson",
              name: "Wilson Blade 98",
              price: "239.999đ",
              originalPrice: "249.999đ",
              discount: "-4%",
              rating: 4.5,
              reviews: 4,
              image: "https://via.placeholder.com/150",
            },
            {
              id: 3,
              brand: "Wilson",
              name: "Wilson Pro Staff 97",
              price: "189.999đ",
              originalPrice: "1.999.999đ",
              discount: "-91%",
              rating: 5,
              reviews: 8,
              image: "https://via.placeholder.com/150",
            },
          ].map((product) => (
            <Posts key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;
