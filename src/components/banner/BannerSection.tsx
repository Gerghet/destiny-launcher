import {
	closestCenter,
	closestCorners,
	defaultDropAnimation,
	DndContext,
	DragOverlay,
	DropAnimation,
	KeyboardSensor,
	PointerSensor,
	rectIntersection,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	rectSortingStrategy,
	SortableContext,
	sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import hydrate from "next-mdx-remote/hydrate";
import type { MdxRemote } from "next-mdx-remote/types";
import React, { useState } from "react";
import { createPortal } from "react-dom";

import type { HydratedBannerType } from "@/@types/DataTypes";
import type { BannerProps } from "@/pages";

import DroppableContainer from "../dnd/DroppableContainer";
import Banner from "./Banner";
import styles from "./BannerSection.module.scss";
import H4 from "./H4";

const TITLES: { [key in string]: string } = {
	favourite: "Favourites",
	manager: "Account Managers",
	info: "Informational sites",
	sheet: "Community spreadsheets",
};

const dropAnimation: DropAnimation = {
	...defaultDropAnimation,
	dragSourceOpacity: 0.5,
};

const VOID_ID = "__void__";

type Keys = "favourite" | "manager" | "info" | "sheet";

type Banners = {
	[key in Keys]: HydratedBannerType[];
};

export default function BannerSection({ banners: rawBanners }: BannerProps) {
	const hydratedBanners = rawBanners.map((banner) => {
		const content = hydrate(banner.content, {
			components: { h4: H4 },
		});
		return { ...banner, content };
	});

	const [banners, setBanners] = useState(() => {
		const favourite = hydratedBanners.filter(
			(banner) => banner.data.category === "favourite",
		);
		const manager = hydratedBanners.filter(
			(banner) => banner.data.category === "manager",
		);
		const info = hydratedBanners.filter(
			(banner) => banner.data.category === "info",
		);
		const sheet = hydratedBanners.filter(
			(banner) => banner.data.category === "sheet",
		);
		return {
			favourite,
			manager,
			info,
			sheet,
		};
	});

	const [clonedItems, setClonedItems] = useState<Banners | null>(null);
	const [activeId, setActiveId] = useState<string | null>(null);

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const findContainer = (id: string) => {
		if (id in banners) {
			return id as Keys;
		}

		return Object.keys(banners).find((key) =>
			banners[key as Keys].some((banner) => banner.id === id),
		) as Keys;
	};

	const getIndex = (id: string) => {
		const container = findContainer(id);

		if (!container) {
			return -1;
		}

		const index = banners[container as Keys].findIndex(
			(banner) => banner.id === id,
		);

		return index;
	};

	const onDragCancel = () => {
		if (clonedItems) {
			// Reset items to their original state in case items have been
			// Dragged across containrs
			setBanners(clonedItems);
		}

		setActiveId(null);
		setClonedItems(null);
	};

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={rectIntersection}
			onDragStart={(event) => {
				const { active } = event;
				setActiveId(active.id);
				setClonedItems(banners);
			}}
			onDragOver={(event) => {
				const { active, over } = event;
				const overId = over?.id;

				if (!overId) {
					return;
				}

				const overContainer = findContainer(overId);
				const activeContainer = findContainer(active.id);

				if (!overContainer || !activeContainer) {
					return;
				}

				if (activeContainer !== overContainer) {
					setBanners((items) => {
						const activeItems = items[activeContainer];

						const overItems = items[overContainer];
						const overIndex = overItems.findIndex(
							(banner) => banner.id === overId,
						);
						const activeIndex = activeItems.findIndex(
							(banner) => banner.id === active.id,
						);

						let newIndex: number;

						if (overId in items) {
							newIndex = overItems.length + 1;
						} else {
							const isBelowLastItem =
								over &&
								overIndex === overItems.length - 1 &&
								active.rect.current.translated &&
								active.rect.current.translated.offsetTop >
									over.rect.offsetTop + over.rect.height;

							const modifier = isBelowLastItem ? 1 : 0;

							newIndex =
								overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
						}

						return {
							...items,
							[activeContainer]: [
								...items[activeContainer].filter(
									(item) => item.id !== active.id,
								),
							],
							[overContainer]: [
								...items[overContainer].slice(0, newIndex),

								items[activeContainer][activeIndex],

								...items[overContainer].slice(
									newIndex,

									items[overContainer].length,
								),
							],
						};
					});
				}
			}}
			onDragEnd={(event) => {
				const { active, over } = event;
				const activeContainer = findContainer(active.id);

				if (!activeContainer) {
					setActiveId(null);
					return;
				}

				const overId = over?.id || VOID_ID;
				/*
				if (overId === VOID_ID) {
					// @ts-expect-error: keys should be the same
					setBanners((items) => ({
						...(false && over?.id === VOID_ID ? items : clonedItems),
						[VOID_ID]: [],
					}));
					setActiveId(null);
					return;
				}
				*/
				const overContainer = findContainer(overId);

				if (activeContainer && overContainer) {
					const activeIndex = banners[activeContainer].findIndex(
						(banner) => banner.id === active.id,
					);

					const overIndex = banners[overContainer].findIndex(
						(banner) => banner.id === overId,
					);

					if (activeIndex !== overIndex) {
						setBanners((items) => ({
							...items,
							[overContainer]: arrayMove(
								items[overContainer],
								activeIndex,
								overIndex,
							),
						}));
					}
				}

				setActiveId(null);
			}}
			onDragCancel={onDragCancel}
		>
			{Object.keys(banners).map((containerId) => {
				return (
					<SortableContext
						key={containerId}
						items={banners[containerId as Keys]}
						strategy={rectSortingStrategy}
					>
						<h2 className={styles.headerText}>{TITLES[containerId as Keys]}</h2>

						<DroppableContainer
							id={containerId}
							// items={banners[containerId as Keys].map((banner) => banner.id)}
							className={styles.bannerSection}
						>
							{banners[containerId as Keys].map((banner) => {
								return (
									<Banner key={banner.id} id={banner.id} {...banner.data}>
										{banner.content}
									</Banner>
								);
							})}
						</DroppableContainer>
					</SortableContext>
				);
			})}
			{/* typeof window !== "undefined" &&
				createPortal(
					<DragOverlay dropAnimation={dropAnimation}>
						{activeId ? (
							<Banner
								id="asd"
								{...banners[findContainer(activeId)!].find(
									(item) => item.id === activeId,
								)!.data}
							>
								asd
							</Banner>
						) : null}
					</DragOverlay>,
					document.body,
								) */}
		</DndContext>
	);
}
