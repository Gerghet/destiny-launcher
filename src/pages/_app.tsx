import "@/styles/core.css";
import "@/styles/fonts.scss";
import "@/styles/components.scss";
import "@/styles/utilities.css";
import "@/styles/global.scss";

import type { AppProps, NextWebVitalsMetric } from "next/app";
import { useRouter } from "next/dist/client/router";
import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import * as gtag from "@/utils/gtag";

export function reportWebVitals({
	id,
	name,
	label,
	value,
}: NextWebVitalsMetric) {
	// Use `window.gtag` if you initialized Google Analytics as this example:
	// https://github.com/vercel/next.js/blob/canary/examples/with-google-analytics/pages/_document.js
	window.gtag("event", name, {
		event_category:
			label === "web-vital" ? "Web Vitals" : "Next.js custom metric",
		value: Math.round(name === "CLS" ? value * 1000 : value), // values must be integers
		event_label: id, // id unique to current page load
		non_interaction: true, // avoids affecting bounce rate.
	});
}

export default function DLApp({ Component, pageProps }: AppProps) {
	const router = useRouter();
	React.useEffect(() => {
		const handleRouteChange = (url: string) => {
			gtag.pageview(url);
		};
		router.events.on("routeChangeComplete", handleRouteChange);
		return () => {
			router.events.off("routeChangeComplete", handleRouteChange);
		};
	}, [router.events]);

	return (
		<React.StrictMode>
			<DndProvider backend={HTML5Backend}>
				<Component {...pageProps} />
			</DndProvider>
		</React.StrictMode>
	);
}
