import clsx from "clsx";
import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";
import { FaAngleDown } from "react-icons/fa";

import styles from "./Banner.module.scss";

type BannerProps = {
	iconSrc: string;
	headerText: string;
	previewImage: string;
	url: string;
} & React.HTMLProps<HTMLDivElement>;

export default function Banner({
	iconSrc,
	headerText,
	previewImage,
	url,
	children,
}: BannerProps) {
	// Banners are hydrated with them being closed, less layout shift
	const [isOpened, setOpened] = React.useState(false);

	React.useEffect(() => {
		const value = localStorage.getItem(url);
		// But when the page loads they are opened if there is no stored value
		setOpened(value !== null ? JSON.parse(value) : true);
		return () => {};
	}, [url]);

	React.useEffect(() => {
		localStorage.setItem(url, JSON.stringify(isOpened));
		return () => {};
	}, [url, isOpened]);

	return (
		<article
			className={clsx(styles.banner, isOpened ? "row-span-4" : "row-span-1")}
		>
			<div className={styles.container}>
				<div className={styles.header}>
					<div className="flex items-center p-2 py-4 w-14 bg-banner-dark">
						<a
							className="relative block w-10 h-10"
							href={url}
							target="_blank"
							rel="noopener"
							aria-label={`${headerText} link`}
						>
							<Image
								src={iconSrc}
								objectFit="cover"
								layout="fill"
								alt={`${headerText} icon`}
							/>
						</a>
					</div>

					<h3 className={styles.headerText}>
						<a href={url} target="_blank" rel="noopener">
							{headerText}
						</a>
					</h3>

					<motion.div
						className={styles.toggle}
						animate={{
							rotate: isOpened ? 180 : 0,
						}}
						transition={{
							duration: 0.3,
							ease: "backInOut",
						}}
					>
						<button
							type="button"
							onClick={() => {
								setOpened(!isOpened);
							}}
							aria-label="Toggle open button"
						>
							<FaAngleDown className="text-5xl" />
						</button>
					</motion.div>
				</div>

				<div
					className={clsx(
						"aspect-w-16 aspect-h-9",
						isOpened ? "block" : "hidden",
					)}
				>
					<a
						href={url}
						target="_blank"
						rel="noopener"
						aria-label={`${headerText} link`}
					>
						<Image
							src={previewImage}
							objectFit="cover"
							layout="fill"
							alt={`${headerText} preview`}
						/>
					</a>
				</div>

				<figure className={clsx(styles.figure, isOpened ? "block" : "hidden")}>
					{children}
					<a
						className={styles.button}
						href={url}
						target="_blank"
						rel="noopener"
					>
						Open
					</a>
				</figure>
			</div>
		</article>
	);
}
