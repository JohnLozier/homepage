import Axios from "axios";

const ConvertToOpacity = async (url: string) => {
	const { data } = await Axios(url, {
		responseType: "blob"
	});

	const img = await createImageBitmap(data);
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");
	canvas.width = img.width;
	canvas.height = img.height;

	ctx!.globalCompositeOperation = "destination-over";
	ctx!.drawImage(img, 0, 0);

	const imageData = ctx!.getImageData(0, 0, canvas.width, canvas.height);
	const content = imageData.data;

	for (let i = 0; i < content.length; i += 4) {
		const alpha = (content[i] + content[i + 1] + content[i + 2]) / 3;

		content[i] = Math.round(255 * (255 / alpha));
		content[i + 1] = Math.round(255 * (255 / alpha));
		content[i + 2] = Math.round(255 * (255 / alpha));
		content[i + 3] = alpha;
	};

	ctx!.putImageData(imageData, 0, 0);

	return new Promise<string>(resolve => {
		canvas.toBlob((blob) =>
			resolve(URL.createObjectURL(blob!))
		, "image/png");
	});
};

export default ConvertToOpacity;