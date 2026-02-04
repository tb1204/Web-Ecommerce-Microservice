// import { UserButton } from "@clerk/clerk-react";
//import { Link } from "react-router-dom";
import Banner from "../components/common/Banner";
import ProductGrid from "../components/Products/FeaturedCategories";
import ItemProductGrid from "../components/layouts/ItemProductGrid";
import ProductBundle from "../components/Products/ProductBundle";
function HomePage() {
  return (
    <>
      <Banner></Banner>
      <ProductGrid></ProductGrid>
      <ItemProductGrid></ItemProductGrid>
      <ProductBundle></ProductBundle>
    </>
  );
}

export default HomePage;
