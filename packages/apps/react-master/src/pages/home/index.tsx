import React, { useState } from "react";
import Navigation from "../../comonents/navigation";
import Card from "../../comonents/card";
import Tabs from "./tabs";

type Props = {};

const Home = (props: Props) => {
	// 表示切换后的目录应不应该隐藏
	const [hide, setHide] = useState<boolean>(true);

	const handleChange = (isHide: boolean) => {
		setHide(isHide);
	};

	return (
		<div className=" bg-gray-100 ">
			<Navigation className="sticky top-0" hide={hide} />
			<div className="mx-auto max-w-5xl flex my-2 px-2 ">
				<Card className="w-2/3">
					<Tabs onChange={handleChange} />
				</Card>
				<div className="w-1/3 flex flex-col flex-1">
					<Card className="w-full">creation</Card>
					<Card className="w-full">buttons</Card>
					<Card className="w-full">functions</Card>
				</div>
			</div>
		</div>
	);
};

export default Home;
