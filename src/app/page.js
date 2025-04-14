import Navbar from "@/components/layout/HeaderComponent";
import ProductList from "@/pages/product-list/productList"; // Importación correcta

export default function Home() {
    return (
        <div>
            <Navbar />
            <ProductList />
        </div>
    );
}