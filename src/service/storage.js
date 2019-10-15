const path = require('path');
const fs = require('fs').promises;
const rootPath = require('env-paths')('js-player').data;

console.log(rootPath);
const STORAGE_DIR = rootPath;
const DOWNLOAD_DIR = 'downloads';

class Storage {
	constructor(storageDir, downloadDir) {
		this.storageDir_ = path.resolve(storageDir);
		this.downloadDir_ = path.resolve(storageDir, downloadDir);
		this.prepareDir_();
	}

	get downloadDir() {
		return this.downloadDir_;
	}

	prepareDir_() {
		return this.prepareDirPromise_ = this.prepareDirPromise_ || new Promise(async resolve => {
			await fs.mkdir(this.storageDir_).catch(() => null);
			await fs.mkdir(this.downloadDir_).catch(() => null);
			resolve();
		});
	}

	get videoList() {
		return this.videoListPromise_ = this.videoListPromise_ ||
			this.prepareDir_().then(() => fs.readdir(this.downloadDir_));
	}

	async readVideo(videoName) {
		return fs.readFile(await this.videoPath(videoName));
	}

	async videoPath(videoName) {
		await this.prepareDir_();
		return path.resolve(this.downloadDir_, videoName);
	}

	async removeVideo(videoName) {
		await this.prepareDir_();
		this.videoListPromise_ = Promise.resolve((await this.videoList).filter(a => a !== videoName));
		await fs.unlink(path.resolve(this.downloadDir_, videoName));
	}
}

module.exports = new Storage(STORAGE_DIR, DOWNLOAD_DIR);
