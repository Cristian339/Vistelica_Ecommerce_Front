// src/services/chatbotService.js
const knowledgeBase = [
    // Saludos y presentación
    {
        keywords: ['hola', 'saludar', 'buenos días', 'buenas tardes', 'buenas noches', 'ayuda'],
        response: '¡Hola! Soy el asistente virtual de Vistelica. ¿Cómo puedo ayudarte hoy?'
    },

    // Preguntas generales sobre pedidos
    {
        keywords: ['estado', 'pedido', 'seguimiento', 'donde está', 'ubicación pedido'],
        response: 'Puedes consultar el estado de tu pedido accediendo a tu cuenta > Mis Pedidos. Allí encontrarás el número de seguimiento y el estado actual. También recibirás notificaciones por email sobre los cambios en el estado de tu envío.'
    },
    {
        keywords: ['tiempo', 'llegada', 'cuánto tarda', 'plazo entrega'],
        response: 'Los tiempos de entrega habituales son: 24-48h para península, 48-72h para islas Baleares, y 3-6 días para Canarias. En periodos de alta demanda como rebajas, estos plazos pueden extenderse ligeramente.'
    },
    {
        keywords: ['gastos', 'envío', 'costo envío', 'cuánto cuesta envío', 'precio envío'],
        response: 'Los gastos de envío son de 3,95€ para pedidos inferiores a 50€. Para pedidos superiores a 50€, el envío es GRATUITO en península y Baleares. Para envíos a Canarias, consulta las tarifas especiales en la sección de envíos.'
    },
    {
        keywords: ['formas', 'pago', 'métodos', 'tarjeta', 'paypal'],
        response: 'En Vistelica aceptamos múltiples formas de pago: tarjetas de crédito/débito (Visa, MasterCard, American Express), PayPal, Apple Pay y Google Pay. No realizamos envíos contrareembolso.'
    },
    {
        keywords: ['compra', 'correcta', 'confirmación', 'verificar pedido'],
        response: 'Una vez completada tu compra, recibirás un email de confirmación con los detalles de tu pedido. También puedes verificarlo accediendo a tu cuenta > Mis Pedidos, donde encontrarás toda la información.'
    },
    {
        keywords: ['modificar', 'dirección', 'cambiar dirección', 'otra dirección'],
        response: 'Solo es posible modificar la dirección de entrega si el pedido aún no ha sido procesado. Contacta urgentemente con nuestro servicio de atención al cliente a través del formulario web o llamando al 900 123 456 (L-V 9:00-18:00h).'
    },
    {
        keywords: ['no recibido', 'perdido', 'no llegó', 'extraviado'],
        response: 'Si has superado el plazo de entrega estimado y no has recibido tu pedido, verifica primero su estado en "Mi cuenta > Mis Pedidos". Si el estado indica que fue entregado pero no lo has recibido, contacta inmediatamente con nuestro servicio de cliente.'
    },
    {
        keywords: ['modificar pedido', 'cambiar pedido'],
        response: 'Una vez realizado el pedido, no es posible modificarlo (añadir/quitar productos o cambiar tallas). Si deseas hacer cambios, deberás cancelar el pedido (si aún es posible) y realizar uno nuevo, o esperar a recibir el pedido y solicitar un cambio/devolución.'
    },
    {
        keywords: ['pedidos partidos', 'varios paquetes', 'partes', 'paquetes separados'],
        response: 'En ocasiones, tu pedido puede dividirse en varios envíos para agilizar la entrega. No te preocupes, esto no supone ningún coste adicional y recibirás notificaciones de seguimiento para cada paquete.'
    },
    {
        keywords: ['tarjeta regalo', 'canjear', 'tienda física', 'usar tarjeta regalo'],
        response: 'Las Tarjetas Regalo virtuales de Vistelica son exclusivas para nuestra tienda online y no pueden canjearse en tiendas físicas, ya que somos una tienda exclusivamente online.'
    },
    {
        keywords: ['vestuario laboral', 'ropa trabajo', 'uniformes'],
        response: 'Ofrecemos soluciones personalizadas para vestuario laboral y uniformes corporativos. Para consultas sobre este servicio, contacta con nuestro departamento especializado en empresas@vistelica.com.'
    },
    {
        keywords: ['cancelar', 'anular pedido', 'cancelación'],
        response: 'Puedes cancelar tu pedido solo si aún no ha sido procesado. Ve a "Mi cuenta > Mis Pedidos", selecciona el pedido y haz clic en "Cancelar". Si no ves esta opción, significa que ya está en proceso de envío y deberás esperar a recibirlo para solicitar una devolución.'
    },
    {
        keywords: ['agotado', 'sin stock', 'avisar', 'disponible', 'notificar'],
        response: 'Sí, en la ficha de cada producto agotado encontrarás la opción "Avisarme cuando esté disponible". Introduce tu email y te notificaremos en cuanto el artículo esté nuevamente en stock.'
    },
    {
        keywords: ['factura', 'recibo', 'comprobante'],
        response: 'Puedes descargar la factura de tu pedido accediendo a "Mi cuenta > Mis Pedidos > Ver detalles > Descargar factura". También puedes solicitarla posteriormente a través del formulario de contacto indicando el número de pedido.'
    },

    // Preguntas sobre cambios y devoluciones
    {
        keywords: ['cambios', 'devoluciones', 'devolver', 'proceso devolución'],
        response: 'Sí, en Vistelica aceptamos cambios y devoluciones. Tienes 14 días naturales desde la recepción para solicitar una devolución, y hasta 30 días para solicitar cambios. Para productos de temporada (rebajas, colecciones especiales) el plazo se reduce a 7 días.'
    },
    {
        keywords: ['costes', 'costos', 'precio devolución', 'gastos devolución'],
        response: 'Las devoluciones a través de nuestro servicio de recogida a domicilio tienen un coste de 3,95€ que se deducirá del importe a devolver. Si prefieres devolver el artículo en un punto de recogida autorizado, la devolución es gratuita.'
    },
    {
        keywords: ['cómo devolver', 'proceso devolución', 'pasos devolver', 'realizar devolución'],
        response: 'Para realizar una devolución: 1) Accede a "Mi cuenta > Mis Pedidos", 2) Selecciona el pedido e indica qué productos deseas devolver, 3) Elige entre recogida a domicilio (coste 3,95€) o devolución en un punto autorizado (gratuito), 4) Empaqueta el producto en su embalaje original con todas las etiquetas, 5) Adjunta la etiqueta de devolución que te facilitamos.'
    },
    {
        keywords: ['cambio artículo diferente', 'cambiar por otro', 'otro modelo'],
        response: 'No es posible cambiar un artículo por uno diferente. Solo se pueden realizar cambios de talla o color del mismo modelo. Para obtener otro artículo, deberás realizar una devolución y hacer una nueva compra.'
    },
    {
        keywords: ['tiempo cambio', 'cuándo recibiré cambio', 'plazo cambio'],
        response: 'Una vez recibamos el artículo en nuestro almacén y verifiquemos su estado (1-2 días laborables), procesaremos el envío del nuevo producto. El tiempo total estimado es de 5-7 días laborables desde que realizas la solicitud de cambio.'
    },
    {
        keywords: ['devolución importe', 'reembolso', 'cómo me devuelven', 'dinero'],
        response: 'El reembolso se realizará utilizando el mismo método de pago que usaste para la compra. Si pagaste con tarjeta, el importe se devolverá a la misma tarjeta; si fue con PayPal, a tu cuenta de PayPal.'
    },
    {
        keywords: ['tiempo reembolso', 'cuándo dinero', 'plazo devolución dinero'],
        response: 'Una vez recibido y verificado el artículo en nuestro almacén, el reembolso se procesará en un plazo de 3-5 días laborables. Dependiendo de tu entidad bancaria, puede tardar hasta 7-14 días en reflejarse en tu cuenta.'
    },
    {
        keywords: ['área personal', 'acceder cuenta', 'solicitar devolución cuenta'],
        response: 'Para acceder al área de devoluciones, inicia sesión en tu cuenta de Vistelica, ve a la sección "Mi Cuenta" en el menú superior, selecciona "Mis Pedidos" y busca el pedido que deseas devolver. Allí encontrarás la opción "Solicitar devolución o cambio".'
    },
    {
        keywords: ['contrareembolso', 'pagar recepción', 'efectivo entrega'],
        response: 'No, en Vistelica no ofrecemos la opción de pago contrareembolso. Puedes utilizar tarjeta de crédito/débito, PayPal, Apple Pay o Google Pay para realizar tus compras de forma segura.'
    },

    // Métodos de pago
    {
        keywords: ['métodos pago', 'formas pagar', 'opciones pago'],
        response: 'En Vistelica aceptamos: 1) Tarjetas de crédito y débito (Visa, MasterCard, American Express), 2) PayPal, 3) Apple Pay, 4) Google Pay. Todas las transacciones están protegidas con los más altos estándares de seguridad.'
    },

    // Respuesta por defecto
    {
        keywords: ['default'],
        response: 'Lo siento, no tengo información específica sobre esa consulta. ¿Puedes reformular tu pregunta o contactar con nuestro servicio de atención al cliente en atencionalcliente@vistelica.com o llamando al 900 123 456 (L-V 9:00-18:00h)?'
    }
];

// Organiza las preguntas en categorías
const categories = {
    "Pedidos y envíos": [
        "¿Cómo puedo hacer seguimiento de mi pedido?",
        "¿Cuánto tiempo tarda en llegar mi pedido?",
        "¿Cuáles son los gastos de envío?",
        "Mi pedido no ha llegado",
        "¿Envían a Canarias?",
        "¿Por qué mi pedido viene en varios paquetes?"
    ],
    "Devoluciones y cambios": [
        "¿Cómo puedo devolver un producto?",
        "¿Cuánto tiempo tengo para devolver un producto?",
        "¿La devolución tiene algún coste?",
        "¿Cuánto tarda el reembolso?",
        "¿Puedo cambiar un artículo por otro diferente?",
        "¿Cuándo recibiré mi cambio?"
    ],
    "Pagos": [
        "¿Qué formas de pago aceptan?",
        "¿Aceptan contrareembolso?",
        "¿Cómo funcionan las tarjetas regalo?",
        "¿Dónde puedo descargar mi factura?"
    ],
    "Mi cuenta": [
        "¿Cómo modifico mis datos personales?",
        "¿Cómo cancelo mi pedido?",
        "¿Puedo modificar la dirección de envío?",
        "¿Cómo me avisan cuando un producto agotado vuelve a estar disponible?"
    ]
};

// Función para obtener las categorías y preguntas
export const getChatCategories = async () => {
    return categories;
};

// Función para encontrar la mejor respuesta basada en preguntas exactas
export const getResponse = async (userQuestion) => {
    // Para preguntas sobre pedidos y envíos
    if (userQuestion === "¿Cómo puedo hacer seguimiento de mi pedido?") {
        return "Puedes consultar el estado de tu pedido accediendo a tu cuenta > Mis Pedidos. Allí encontrarás el número de seguimiento y el estado actual. También recibirás notificaciones por email sobre los cambios en el estado de tu envío.";
    }
    if (userQuestion === "¿Cuánto tiempo tarda en llegar mi pedido?") {
        return "Los tiempos de entrega habituales son: 24-48h para península, 48-72h para islas Baleares, y 3-6 días para Canarias. En periodos de alta demanda como rebajas, estos plazos pueden extenderse ligeramente.";
    }
    if (userQuestion === "¿Cuáles son los gastos de envío?") {
        return "Los gastos de envío son de 3,95€ para pedidos inferiores a 50€. Para pedidos superiores a 50€, el envío es GRATUITO en península y Baleares. Para envíos a Canarias, consulta las tarifas especiales en la sección de envíos.";
    }
    if (userQuestion === "Mi pedido no ha llegado") {
        return "Si has superado el plazo de entrega estimado y no has recibido tu pedido, verifica primero su estado en 'Mi cuenta > Mis Pedidos'. Si el estado indica que fue entregado pero no lo has recibido, contacta inmediatamente con nuestro servicio de cliente.";
    }
    if (userQuestion === "¿Envían a Canarias?") {
        return "Sí, realizamos envíos a las Islas Canarias. Ten en cuenta que los plazos son de 3-6 días laborables y pueden aplicarse tasas aduaneras adicionales que corren a cargo del cliente.";
    }
    if (userQuestion === "¿Por qué mi pedido viene en varios paquetes?") {
        return "En ocasiones, tu pedido puede dividirse en varios envíos para agilizar la entrega. No te preocupes, esto no supone ningún coste adicional y recibirás notificaciones de seguimiento para cada paquete.";
    }

    // Para preguntas sobre devoluciones y cambios
    if (userQuestion === "¿Cómo puedo devolver un producto?") {
        return "Para realizar una devolución: 1) Accede a 'Mi cuenta > Mis Pedidos', 2) Selecciona el pedido e indica qué productos deseas devolver, 3) Elige entre recogida a domicilio (coste 3,95€) o devolución en un punto autorizado (gratuito), 4) Empaqueta el producto en su embalaje original con todas las etiquetas, 5) Adjunta la etiqueta de devolución que te facilitamos.";
    }
    if (userQuestion === "¿Cuánto tiempo tengo para devolver un producto?") {
        return "Tienes 14 días naturales desde la recepción para solicitar una devolución, y hasta 30 días para solicitar cambios. Para productos de temporada (rebajas, colecciones especiales) el plazo se reduce a 7 días.";
    }
    if (userQuestion === "¿La devolución tiene algún coste?") {
        return "Las devoluciones a través de nuestro servicio de recogida a domicilio tienen un coste de 3,95€ que se deducirá del importe a devolver. Si prefieres devolver el artículo en un punto de recogida autorizado, la devolución es gratuita.";
    }
    if (userQuestion === "¿Cuánto tarda el reembolso?") {
        return "Una vez recibido y verificado el artículo en nuestro almacén, el reembolso se procesará en un plazo de 3-5 días laborables. Dependiendo de tu entidad bancaria, puede tardar hasta 7-14 días en reflejarse en tu cuenta.";
    }
    if (userQuestion === "¿Puedo cambiar un artículo por otro diferente?") {
        return "No es posible cambiar un artículo por uno diferente. Solo se pueden realizar cambios de talla o color del mismo modelo. Para obtener otro artículo, deberás realizar una devolución y hacer una nueva compra.";
    }
    if (userQuestion === "¿Cuándo recibiré mi cambio?") {
        return "Una vez recibamos el artículo en nuestro almacén y verifiquemos su estado (1-2 días laborables), procesaremos el envío del nuevo producto. El tiempo total estimado es de 5-7 días laborables desde que realizas la solicitud de cambio.";
    }

    // Para preguntas sobre pagos
    if (userQuestion === "¿Qué formas de pago aceptan?") {
        return "En Vistelica aceptamos: 1) Tarjetas de crédito y débito (Visa, MasterCard, American Express), 2) PayPal, 3) Apple Pay, 4) Google Pay. Todas las transacciones están protegidas con los más altos estándares de seguridad.";
    }
    if (userQuestion === "¿Aceptan contrareembolso?") {
        return "No, en Vistelica no ofrecemos la opción de pago contrareembolso. Puedes utilizar tarjeta de crédito/débito, PayPal, Apple Pay o Google Pay para realizar tus compras de forma segura.";
    }
    if (userQuestion === "¿Cómo funcionan las tarjetas regalo?") {
        return "Las Tarjetas Regalo virtuales de Vistelica son exclusivas para nuestra tienda online y no pueden canjearse en tiendas físicas, ya que somos una tienda exclusivamente online. Pueden utilizarse en múltiples compras hasta agotar su saldo.";
    }
    if (userQuestion === "¿Dónde puedo descargar mi factura?") {
        return "Puedes descargar la factura de tu pedido accediendo a 'Mi cuenta > Mis Pedidos > Ver detalles > Descargar factura'. También puedes solicitarla posteriormente a través del formulario de contacto indicando el número de pedido.";
    }

    // Para preguntas sobre mi cuenta
    if (userQuestion === "¿Cómo modifico mis datos personales?") {
        return "Para modificar tus datos personales, inicia sesión y ve a 'Mi Cuenta > Datos Personales'. Allí podrás actualizar tu dirección, teléfono y otros datos. Ten en cuenta que el email no se puede modificar una vez creada la cuenta.";
    }
    if (userQuestion === "¿Cómo cancelo mi pedido?") {
        return "Puedes cancelar tu pedido solo si aún no ha sido procesado. Ve a 'Mi cuenta > Mis Pedidos', selecciona el pedido y haz clic en 'Cancelar'. Si no ves esta opción, significa que ya está en proceso de envío y deberás esperar a recibirlo para solicitar una devolución.";
    }
    if (userQuestion === "¿Puedo modificar la dirección de envío?") {
        return "Solo es posible modificar la dirección de entrega si el pedido aún no ha sido procesado. Contacta urgentemente con nuestro servicio de atención al cliente a través del formulario web o llamando al 900 123 456 (L-V 9:00-18:00h).";
    }
    if (userQuestion === "¿Cómo me avisan cuando un producto agotado vuelve a estar disponible?") {
        return "En la ficha de cada producto agotado encontrarás la opción 'Avisarme cuando esté disponible'. Introduce tu email y te notificaremos en cuanto el artículo esté nuevamente en stock.";
    }

    // Respuesta por defecto
    return "Lo siento, no tengo información sobre esa consulta específica. Por favor, selecciona otra pregunta del menú o contacta con nuestro servicio de atención al cliente en vistelica.company@gmail.com";
};

// Función auxiliar para calcular la puntuación de coincidencia
const calculateMatchScore = (message, keywords) => {
    let matchCount = 0;
    let keywordFound = false;

    for (const keyword of keywords) {
        if (message.includes(keyword)) {
            matchCount++;
            keywordFound = true;
        }
    }

    // Si se encontró al menos una palabra clave exacta
    if (keywordFound) {
        return matchCount / keywords.length;
    }

    // Verificación más flexible para encontrar coincidencias parciales
    const messageParts = message.split(' ');
    for (const keyword of keywords) {
        for (const part of messageParts) {
            if (part.length > 3 && keyword.includes(part)) {
                matchCount += 0.5;  // Coincidencia parcial
            }
        }
    }

    return matchCount / keywords.length;
};