import Navbar from "@/components/layout/HeaderComponent";
import ProductList from "@/pages/product-list/productList";
import FooterComponent from "@/components/layout/FooterComponent";
import HomePage from "@/pages/home/Home"; // Importación correcta

export default function Home() {
    return (
        <div>
{/*            <Navbar />
            <ProductList />
            <FooterComponent />*/}

            <HomePage/>
        </div>
    );
}