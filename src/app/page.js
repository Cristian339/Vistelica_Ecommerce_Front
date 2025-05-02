import SignInSide from "../pages/sign-in-side/Sign-in-side";
import Navbar from "@/components/layout/HeaderComponent";
import ImageCarousel from "@/pages/home/components/ImageCarousel";
import Typography from "@mui/material/Typography";
import {Container} from "@mui/material";
import HomePage from "@/pages/home/Home";
import AdminPage from "@/pages/admin/page";
import ProductDetail from "@/pages/product-detail/page";
import ProductList from "@/pages/product-list/productList";
  // Ruta del componente HomePage

export default function Home() {
    return (
        <div>
            <HomePage />
        </div>
    );
}

/*
*         <div>
            <Navbar />
            <ProductList />
            <FooterComponent />
        </div>
*
* */
