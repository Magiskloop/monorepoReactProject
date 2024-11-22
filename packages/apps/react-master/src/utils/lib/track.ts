import { AsyncTrackQueue } from "./async-track-queue";

export interface UserTrackData {
	msg?: string;
}

interface TrackData {
	id: string;
	seqId: number;
	timestamp: number;
}
// 假设 BaseTrack 是埋点的api，每一次调用，是不是马上发起请求? --不可以
// 所以有些sendlog，先收集，再一起发送
export class BaseTrack extends AsyncTrackQueue<TrackData> {
	private seq = 0;
	// 收集
	public track(data: UserTrackData) {
		this.addTask({
			id: `${Math.random()}`,
			seqId: this.seq++,
			timestamp: Date.now(),
			...data,
		});
	}
	// 上报
	// 是一个异步批量的逻辑
	public comsumeTaskQueue(data: Array<TrackData & UserTrackData>) {
		/**
		 * return new Promise((resolve)=>{
		 * cosnt image = new Image();
		 * image.src = 'https://uuuu.com/xxx/logs?data=${JSON.stringify(data)}'
		 * })
		 */
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve(data.map((item) => item.msg));
			});
		});
	}
}
