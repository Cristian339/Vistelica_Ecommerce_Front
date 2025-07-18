import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html lang="es">
            <Head>
                {/* Google Fonts - loaded globally */}
                <link
                    href="https://fonts.googleapis.com/css2?family=Amethysta:wght@400&family=Tenor+Sans:wght@400&display=swap"
                    rel="stylesheet"
                />
                {/* You can add other global meta tags, links, etc. here */}
            </Head>
            <body>
            <Main />
            <NextScript />
            </body>
        </Html>
    );
}