import { useState, useEffect } from "react";
import debounce from "lodash/debounce";

function useIsMobile() {
	const [isMobile, setIsMobile] = useState(window.innerWidth <= 575);

	useEffect(() => {
		const onresize = debounce(function() {
			setIsMobile(window.innerWidth <= 575);
		}, 50);

		window.addEventListener("resize", onresize);

		return () => {
			window.removeEventListener("resize", onresize);
		};
	}, []);

	return isMobile;
}

export default useIsMobile;