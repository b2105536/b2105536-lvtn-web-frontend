const docSoThanhChu = (so) => {
    const Tien = ["", "nghìn", "triệu", "tỷ", "nghìn tỷ", "triệu tỷ"];

    if (typeof so !== 'number') so = parseInt(so);
    if (isNaN(so)) return "";
    if (so === 0) return "Không đồng";

    let str = so.toString();
    let i = 0;
    let result = "";

    while (str.length > 0) {
        let segment = str.length > 3 ? str.slice(-3) : str;
        str = str.length > 3 ? str.slice(0, -3) : "";

        let segmentNum = parseInt(segment);
        if (segmentNum > 0) {
            let docSegment = docBaSo(segment);
            result = docSegment + (Tien[i] ? " " + Tien[i] : "") + (result ? " " + result : "");
        } else if (result) {
            result = Tien[i] + (result ? " " + result : "");
        }
        i++;
    }

    result = result.trim();
    result = result.charAt(0).toUpperCase() + result.slice(1) + " đồng";

    return result;
}

const docBaSo = (baSo) => {
    const ChuSo = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
    baSo = baSo.padStart(3, '0');
    let tram = parseInt(baSo[0]);
    let chuc = parseInt(baSo[1]);
    let donvi = parseInt(baSo[2]);

    let ketQua = "";

    if (tram === 0 && chuc === 0 && donvi === 0) return "";

    if (tram !== 0) {
        ketQua += ChuSo[tram] + " trăm";
        if (chuc === 0 && donvi !== 0) ketQua += " linh";
    }

    if (chuc > 1) {
        ketQua += " " + ChuSo[chuc] + " mươi";
        if (donvi === 0) {
        } else if (donvi === 1) {
            ketQua += " mốt";
        } else if (donvi === 4) {
            ketQua += " tư";
        } else if (donvi === 5) {
            ketQua += " lăm";
        } else {
            ketQua += " " + ChuSo[donvi];
        }
    } else if (chuc === 1) {
        ketQua += " mười";
        if (donvi === 0) {
        } else if (donvi === 5) {
            ketQua += " lăm";
        } else {
            ketQua += " " + ChuSo[donvi];
        }
    } else if (chuc === 0 && donvi !== 0) {
        ketQua += " " + ChuSo[donvi];
    }

    return ketQua.trim();
}

export {docSoThanhChu};