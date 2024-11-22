import { debounce } from "lodash-es";

interface RequireData {
	timestamp: number | string;
}

// queueData还有数据的时候，用户把浏览器关闭了
/**
 * 如果我还有queueData没有上报
 *  就先用localStorage存一下
 * 等下次打开浏览器的时候，再追加上报
 */

class TaskQueueStorableHelper<T extends RequireData = any> {
	// 先来一个单例
	private static instance: TaskQueueStorableHelper | null;
	// 单例
	public static getInstance<T extends RequireData = any>() {
		if (!this.instance) {
			this.instance = new TaskQueueStorableHelper<T>();
		}

		return this.instance;
	}

	// constructor 是再次打开浏览器时需要执行的函数
	// 如果这时指定的key还有内容，说明上次没上报完

	private STORAGE_KEY = "zq_local";
	protected store: any = null;
	constructor() {
		const localStorageVal = localStorage.getItem(this.STORAGE_KEY);
		if (localStorageVal) {
			try {
				this.store = JSON.parse(localStorageVal);
			} catch (error: any) {
				throw new Error(error);
			}
		}
	}

	get queueData() {
		return this.store?.queueData || [];
	}

	set queueData(value: Array<T>) {
		// const _queueData = [...this.store?.queueData, ...value].sort(
		// 	(a, b) => Number(a.timestamp) - Number(b.timestamp),
		// );
		// this.store.queueData = _queueData;

		this.store = {
			...this.store,
			queueData: value.sort(
				(a, b) => Number(a.timestamp) - Number(b.timestamp),
			),
		};
		localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.store));
	}
}

// 第二层，需要做一个收集工作

export abstract class AsyncTrackQueue<T extends RequireData> {
	// 本地存储服务
	private get storableService() {
		return TaskQueueStorableHelper.getInstance();
	}

	// private queueData: Array<T> = [];
	private get queueData(): Array<T> {
		return this.storableService.queueData;
	}
	private set queueData(value: Array<T>) {
		this.storableService.queueData = value;
		if (value.length) {
			this.debounceRun();
		}
	}

	public addTask(data: T | Array<T>) {
		this.queueData = this.queueData.concat(data);
	}

	protected abstract comsumeTaskQueue(data: Array<T>): Promise<any>;

	// 那么何时上报？
	// 在一段时间内，没有 addtask 了，也就是说不再添加数据了，就进行上报
	protected debounceRun = debounce(this.run.bind(this), 500);

	private run() {
		const currentList = this.queueData;
		if (currentList.length) {
			this.queueData = [];
			this.comsumeTaskQueue(currentList);
		}
	}
}
