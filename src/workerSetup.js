export default class workerSetup {

	constructor(worker) {
		const code = worker.toString();
		try{
			const blob = new Blob(['('+code+')()']);
			return new Worker(URL.createObjectURL(blob));
		}
		catch(error){
           console.log(error);
		}
	}


}
