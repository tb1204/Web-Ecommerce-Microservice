import { useState } from "react";
import { Link } from "react-router-dom";
//changa

import bochanga from "../../assets/chan-ga/bo-chan-ga.webp";
import chanvavochan from "../../assets/chan-ga/chan-va-vo-chan-.webp";
import gale from "../../assets/chan-ga/ga-le.webp";
import vogoile from "../../assets/chan-ga/vo-goi-le.webp";
import changagoitreem from "../../assets/chan-ga/chan-ga-goi-tre-em.webp";
import bogachun from "../../assets/chan-ga/bo-ga-chun.webp";
import bogaphu from "../../assets/chan-ga/bo-ga-phu.webp";
import vochanle from "../../assets/chan-ga/vo-chan-le.webp";
import chanle from "../../assets/chan-ga/chan-le.webp";
import bogachunchan from "../../assets/chan-ga/bo-ga-chun-chan.webp";

//goi
import goibong from "../../assets/goi/goi-bong.webp";
import goifoam from "../../assets/goi/goi-foam.webp";
import goicaosu from "../../assets/goi/goi-cao-su.webp";
import goilongvu from "../../assets/goi/goi-long-vu.webp";
import goilammat from "../../assets/goi/goi-lam-mat.webp";
import goigiamdauvaigay from "../../assets/goi/goi-giam-dau-vai-gay.webp";

//nem
import nembongep from "../../assets/nem/nem-bong-ep.webp";
import nemcaosu from "../../assets/nem/nem-cao-su.webp";
import nemloxo from "../../assets/nem/nem-lo-xo.webp";
import nemfoam from "../../assets/nem/nem-foam.webp";

//phukien
import toppernem from "../../assets/phukien/toper-nem.webp";
import tambaovenem from "../../assets/phukien/tam-bao-ve-nem.webp";
import baovegoi from "../../assets/phukien/bao-ve-goi.webp";

interface Product {
  id: number;
  name: string;
  image: string;
  path: string;
}

interface CategoryData {
  [key: string]: Product[];
}

const FeaturedCategories = () => {
  const categoryData: CategoryData = {
    "Chăn ga": [
      {
        id: 1,
        name: "Bộ chăn ga",
        image: bochanga,
        path: "/collections/bo-chan-ga",
      },
      {
        id: 2,
        name: "Chăn và vỏ chăn",
        image: chanvavochan,
        path: "/collections/chan-va-vo-goi",
      },
      {
        id: 3,
        name: "Ga lẻ",
        image: gale,
        path: "/collections/ga-le",
      },
      {
        id: 4,
        name: "Vỏ gối lẻ",
        image: vogoile,
        path: "/collections/vo-goi-le",
      },
      {
        id: 5,
        name: "Chăn ga gối trẻ em",
        image: changagoitreem,
        path: "/collections/chan-ga-goi-tre-em",
      },
      {
        id: 6,
        name: "Bộ ga chun",
        image: bogachun,
        path: "/collections/bo-ga-chun",
      },
      {
        id: 7,
        name: "Bộ ga phủ",
        image: bogaphu,
        path: "/collections/bo-ga-phu",
      },
      {
        id: 8,
        name: "Vỏ chăn lẻ",
        image: vochanle,
        path: "/collections/vo-chan-le",
      },
      {
        id: 9,
        name: "Chăn lẻ",
        image: chanle,
        path: "/collections/chan-le",
      },
      {
        id: 10,
        name: "Bộ ga chun chần",
        image: bogachunchan,
        path: "/collections/bo-ga-chun-chan",
      },
    ],
    Gối: [
      {
        id: 11,
        name: "Gối bông",
        image: goibong,
        path: "/collections/goi-bong",
      },
      {
        id: 12,
        name: "Gối foam",
        image: goifoam,
        path: "/collections/goi-foam",
      },
      {
        id: 13,
        name: "Gối cao su",
        image: goicaosu,
        path: "/collections/goi-cao-su",
      },
      {
        id: 14,
        name: "Gối lông vũ",
        image: goilongvu,
        path: "/collections/goi-long-vu",
      },
      {
        id: 15,
        name: "Gối làm mát",
        image: goilammat,
        path: "/collections/goi-lam-mat",
      },
      {
        id: 16,
        name: "Gối giảm đau vai gáy",
        image: goigiamdauvaigay,
        path: "/collections/goi-giam-dau-vai-gay",
      },
    ],
    Nệm: [
      {
        id: 17,
        name: "Nệm bông ép",
        image: nembongep,
        path: "/collections/nem-bong-ep",
      },
      {
        id: 18,
        name: "Nệm cao su",
        image: nemcaosu,
        path: "/collections/nem-cao-su",
      },
      {
        id: 19,
        name: "Nệm lò xo",
        image: nemloxo,
        path: "/collections/nem-lo-xo",
      },
      {
        id: 20,
        name: "Nệm foam",
        image: nemfoam,
        path: "/collections/nem-foam",
      },
    ],
    "Phụ kiện": [
      {
        id: 21,
        name: "Topper nệm",
        image: toppernem,
        path: "/collections/topper-nem",
      },
      {
        id: 22,
        name: "Tấm bảo vệ nệm",
        image: tambaovenem,
        path: "/collections/tam-bao-ve-nem",
      },
      {
        id: 23,
        name: "Bảo vệ gối",
        image: baovegoi,
        path: "/collections/bao-ve-goi",
      },
    ],
  };

  const tabs = Object.keys(categoryData);
  const [activeTab, setActiveTab] = useState<string>(tabs[0]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 font-sans selection:bg-green-100">
      <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-10 max-w-lg leading-tight">
        Trọn bộ sản phẩm cho giâc ngủ của bạn
      </h2>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3 mb-10">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-2 rounded-full border text-sm font-medium transition-all duration-300 ${
              activeTab === tab
                ? "bg-[#004225] text-white border-[#004225] shadow-lg shadow-green-900/20"
                : "bg-white text-gray-800 border-gray-200 hover:bg-[#004225] hover:text-white hover:border-[#004225]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 ">
        {categoryData[activeTab].map((product) => (
          <Link
            to={product.path}
            key={product.id}
            className="group relative block overflow-hidden rounded-xl bg-gray-100 aspect-[4/5] cursor-pointer"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
            />
            <div className="absolute bottom-5 left-4 right-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <h3 className="text-white font-semibold text-sm md:text-base tracking-wide">
                {product.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FeaturedCategories;
