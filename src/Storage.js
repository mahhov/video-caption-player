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

	get fileList() {
		return this.fileListPromise_ = this.fileListPromise_ ||
			this.prepareDir_().then(() => fs.readdir(this.downloadDir_));
	}

	async readVideo(fileName) {
		await this.prepareDir_();
		return await fs.readFile(path.resolve(this.downloadDir_, fileName));
	}

	async removeVideo(fileName) {
		this.fileListPromise_ = Promise.resolve((await this.fileListPromise_).filter(a => a !== fileName));
		await this.prepareDir_();
		await fs.unlink(path.resolve(this.downloadDir_, fileName));
	}
}

module.exports = new Storage(STORAGE_DIR, DOWNLOAD_DIR);
