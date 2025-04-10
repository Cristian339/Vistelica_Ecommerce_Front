import React from 'react';
import ProductDetail from './components/ProductDetail';

const product = {
    name: "AMERICANA NAPOLI TWILL VERDE",
    reference: "798025056_VER",
    price: "68.95",
    sizes: ["XS", "S", "M", "L", "X", "XL"],
    images: [
        'https://www.alvaromoreno.com/dw/image/v2/BGHK_PRD/on/demandware.static/-/Sites-amoreno_master_catalog/default/dw9880b7e5/images/hi-res/V25/Trajes/Traje_Napoli_Twill_769125056-356_VER/769125056_VER_1.jpg?sw=965&sh=1287',
        '/products/769125056_VER_8.jpg',
        '/products/798025056_VER_1.jpg',
        '/products/any_other_image.jpg'

    ],
    description: "Americana con un corte más relajado y con cuello y solapa ligeramente más ancho. Cierre central mediante dos botones, bolsillo de golf en el pecho, tres bolsillos de solapa en la cintura con una pequeña inclinación y punta con botones decorativas. Interior forrado.",
    composition: "100% Lana. Lavar a mano o en seco. No usar lejía. Planchar a baja temperatura."
};

function App() {
    return (
        <div>
            <ProductDetail product={product} />
        </div>
    );
}

export default App;