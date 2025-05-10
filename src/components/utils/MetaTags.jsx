import { Helmet } from "react-helmet";
const MetaTags = ({ title, description }) => {
  return (
    <Helmet>
      <meta
        name="description"
        content={description || "Stocks Management for you Shop and Warehouses"}
      />
      <meta name="author" content="Mano Codes" />

      <meta
        property="og:title"
        content={title || "Stock Management | Mano Codes"}
      />
      <meta
        property="og:description"
        content={description || "Stocks Management for you Shop and Warehouses"}
      />
      <meta property="og:url" content="" />
      <meta property="og:type" content="Service" />
      <meta property="og:site_name" content="Stock Management | Mano Codes" />
      <meta
        property="og:image"
        content="https://www.thilagasrecipe.in/assets/23-DJQBdHiL.png"
      />
      <meta name="keywords" content="Stocks, Management" />
      <link rel="canonical" href="" />

      <title>{title || "Stock Management | Mano Codes"}</title>
    </Helmet>
  );
};

export default MetaTags;
