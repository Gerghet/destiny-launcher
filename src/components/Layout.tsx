import Head from "next/head";

import Footer from "@/components/Footer";
import Navbar from "@/components/navbar/Navbar";

export default function Layout({
	children,
	...restProps
}: React.HTMLAttributes<HTMLDivElement>): JSX.Element {
	return (
		<>
			<Head>
				<title>Destiny Launcher</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
				<meta
					name="description"
					content="" // TODO: Fill description
				/>
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content="Destiny Launcher" />
				<meta name="twitter:description" content="" />
				<meta
					name="twitter:image"
					content="https://destinylauncher.net/preview.png" // TODO: Change after domain change
				/>
				<meta
					name="thumbnail"
					content="https://destinylauncher.net/preview.png"
				/>
				<meta
					property="og:image"
					content="https://destinylauncher.net/preview.png"
				/>
				<meta property="og:title" content="Destiny Launcher" />
				<meta property="og:description" content="" />
				<meta property="og:url" content="https://destinylauncher.net" />
				<meta property="og:type" content="website" />
				<link
					rel="apple-touch-icon"
					sizes="60x60"
					href="/apple-touch-icon-60x60.png"
				/>
				<link
					rel="apple-touch-icon"
					sizes="76x76"
					href="/apple-touch-icon-76x76.png"
				/>
				<link
					rel="apple-touch-icon"
					sizes="120x120"
					href="/apple-touch-icon-120x120.png"
				/>
				<link
					rel="apple-touch-icon"
					sizes="152x152"
					href="/apple-touch-icon-152x152.png"
				/>
				<link
					rel="apple-touch-icon"
					sizes="180x180"
					href="/apple-touch-icon-180x180.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="32x32"
					href="/favicon-32x32.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="16x16"
					href="/favicon-16x16.png"
				/>
				<link rel="manifest" href="/site.webmanifest" />
				<link
					rel="mask-icon"
					href="/safari-pinned-tab.svg"
					color="#273343" // TODO: change colors
				/>
				<meta name="msapplication-TileColor" content="#273343" />
				<meta name="msapplication-TileImage" content="/mstile-150x150.png" />
				<meta name="theme-color" content="#E6A537" />
			</Head>

			<Navbar />

			<main {...restProps}>{children}</main>

			<Footer />
		</>
	);
}