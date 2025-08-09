import './ContractPreview.scss';
import { docSoThanhChu } from '../../utils/contractHelper';

const N = (val) => (val === null || val === undefined ? "" : val);

const ContractPreview = (props) => {
    const { data, ngayKT } = props;
    
    if (!data & !ngayKT) return null;

    const address = () => {
        const n = data?.Phong?.Nha || {};
        const parts = [];

        if (n.diaChi) parts.push(n.diaChi);
        if (n.Xa?.tenXa) parts.push(n.Xa.tenXa);
        if (n.Xa?.Huyen?.tenHuyen) parts.push(n.Xa.Huyen.tenHuyen);
        if (n.Xa?.Tinh?.tenTinh) parts.push(n.Xa.Tinh.tenTinh);

        return parts.join(", ");
    }

    const nguoiChoThue = data?.Phong?.Nha?.NguoiDung || {};
    const nguoiThue = data?.NguoiDung || {};

    const formatDateOnly = (dateStr) => {
        if (!dateStr) return "ngày ....... tháng ....... năm........";
        const date = new Date(dateStr);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `ngày ${day} tháng ${month} năm ${year}`;
    }
    const formatDateShort = (dateStr) => {
        if (!dateStr) return "……/……/……";
        const date = new Date(dateStr);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    const soHopDong = data?.id ? `${data.id}/HĐ` : "Số………../HĐ";

    const tinhSoThangThue = (ngayBD, ngayKT) => {
        if (!ngayBD || !ngayKT) return 0;

        const start = new Date(ngayBD);
        const end = new Date(ngayKT);

        let months = (end.getFullYear() - start.getFullYear()) * 12;
        months += end.getMonth() - start.getMonth();

        if (end.getDate() < start.getDate()) {
            months--;
        }

        return months > 0 ? months : 0;
    }

    return (
        <div className="contract-preview-root">
            <section className="contract-page">
                <div className="contract-header">
                    <div className="header-center">
                        <div className="country">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                        <div className="motto">Độc lập - Tự do - Hạnh phúc</div>
                        <div className="motto">--------------</div>
                    </div>
                    <div className="place-date">{data?.Phong?.Nha?.Xa?.Tinh?.tenTinh ? data?.Phong?.Nha?.Xa?.Tinh?.tenTinh : "……., "}, {formatDateOnly(data.ngayLap)}</div>
                </div>

                <h2 className="contract-title">HỢP ĐỒNG THUÊ NHÀ Ở SINH VIÊN</h2>
                <div className="contract-number">Số {soHopDong}</div>

                <div className="contract-body">
                    <p>Căn cứ Luật Nhà ở ngày 29 tháng 11 năm 2005;</p>
                    <p>Căn cứ Bộ Luật Dân sự ngày 14 tháng 6 năm 2005;</p>
                    <p>Căn cứ Nghị định số 34/2013/NĐ-CP ngày 22 tháng 4 năm 2013 của Chính phủ về quản lý sử dụng nhà ở thuộc sở hữu nhà nước;</p>
                    <p>Căn cứ Thông tư số 14/2013/TT-BXD ngày 19 tháng 9 năm 2013 của Bộ Xây dựng hướng dẫn thực hiện một số nội dung của Nghị định số 34/2013/NĐ-CP ngày 22 tháng 4 năm 2013 của Chính phủ về quản lý sử dụng nhà ở thuộc sở hữu nhà nước;</p>
                    <p>Căn cứ đơn đề nghị thuê nhà ở của sinh viên {N(nguoiThue.hoTen)} đề ngày {formatDateShort(data.ngayLap)}.</p>
                    <p>Căn cứ (1) ..............................................................................................,</p>
                    <p>Hai Bên chúng tôi gồm:</p>

                    <h6 className="section-title"><strong>BÊN CHO THUÊ NHÀ Ở SINH VIÊN (sau đây gọi tắt là Bên cho thuê)</strong></h6>
                    <ul>
                        <li>Ông (bà): <strong>{N(nguoiChoThue.hoTen)}</strong> Chức vụ:…….........……….....……</li>
                        <li>Đại diện cho: {N(data?.Phong?.Nha?.ten)}</li>
                        <li>Địa chỉ cơ quan / địa chỉ nhà trọ: {address()}</li>
                        <li>Điện thoại: {N(nguoiChoThue.soDienThoai)} Fax:……………………..…….............</li>
                        <li>Tài khoản số: ........………….. tại Ngân hàng...........................................</li>
                        <li>Mã số thuế: ...............................................................................................</li>
                    </ul>
                </div>
            </section>

            <section className="contract-page">
                <div className="contract-body">
                    <h6 className="section-title"><strong>BÊN THUÊ NHÀ Ở SINH VIÊN (sau đây gọi tắt là Bên thuê)</strong></h6>
                    <ul>
                        <li>Họ và tên sinh viên: <strong>{N(nguoiThue.hoTen)}</strong> Nam (Nữ): {nguoiThue.gioiTinh === true ? 'Nam' : 'Nữ'}</li>
                        <li>Tên và địa chỉ cơ sở giáo dục nơi sinh viên học tập: ................................
                            ....................................................................................................................
                        </li>
                        <li>Số CMND/CCCD: {N(nguoiThue.soDD)} cấp ngày......./....../..........tại…..……..........</li>
                        <li>Số thẻ sinh viên (2) (nếu có)……………...cấp ngày…………………….</li>
                        <li>Điện thoại: {N(nguoiThue.soDienThoai)}</li>
                        <li>Liên hệ khi cần báo tin cho người thân: .......................................
                            địa chỉ .......................................... số điện thoại ....................................................
                        </li>
                    </ul>

                    <p>Hai bên thống nhất ký kết hợp đồng thuê nhà ở sinh viên dùng cho mục đích để ở và sinh hoạt của sinh viên với những nội dung sau:</p>

                    <h6 className="section-title">Điều 1. Đặc điểm chính của nhà ở sinh viên</h6>
                    <p>1. Địa điểm thuê: (ghi rõ số phòng, vị trí giường, tên khu nhà ở mà sinh viên được bố trí ở) <strong>{N(data?.Phong?.tenPhong)}</strong>;</p>
                    <p>2. Trang thiết bị nhà ở sinh viên cho thuê (ghi rõ các vật dụng như giường, tủ cá nhân, bàn, ghế; quạt, cấp điện, cấp nước sạch; đầu chờ thông tin liên lạc, truyền hình; thiết bị vệ sinh…)
                        …………………………………….......;</p>
                    <p>3. Phần diện tích sử dụng chung (ghi rõ các phần diện tích như hành lang, lối đi chung, cầu thang, nơi để xe, khu vệ sinh…)
                        ….….........………........;</p>
                    <p>4. Các khu sinh hoạt thể thao, văn hoá trong khu nhà ở sinh viên được sử dụng (ghi rõ khu vực được sử dụng miễn phí, trường hợp có thu phí sử dụng thì phải ghi rõ mức thu)
                        .............................................................................................</p>

                    <h6 className="section-title">Điều 2. Giá thuê và phương thức thanh toán</h6>
                    <p>1. Giá thuê: <strong>{data?.giaThueTrongHD ? Number(data.giaThueTrongHD).toLocaleString("vi-VN") : "......................................."}</strong> VN đồng/chỗ ở/tháng</p>
                    <p>(Bằng chữ: {data?.giaThueTrongHD ? docSoThanhChu(data.giaThueTrongHD) :"........................................................................................."})</p>
                    <p>Giá thuê này tính cho từng sinh viên theo từng tháng. Giá thuê này đã bao gồm cả chi phí quản lý vận hành và chi phí bảo trì nhà ở sinh viên.</p>
                </div>
            </section>

            <section className="contract-page">
                <div className="contract-body">
                    <p>2. Phương thức thanh toán:</p>
                    <p>a) Thanh toán tiền thuê nhà bằng……………….. (tiền mặt hoặc hình thức khác do hai bên thỏa thuận) và trả định kỳ vào ngày........................ trong tháng.</p>
                    <p>b) Các chi phí sử dụng điện, nước, điện thoại và các dịch vụ khác Bên thuê có trách nhiệm thanh toán theo thực tế sử dụng cho bên cung cấp dịch vụ hoặc cho Bên cho thuê.</p>
                    <p>c) Giá thuê nhà ở sinh viên sẽ được điều chỉnh khi Nhà nước có thay đổi khung giá hoặc giá thuê. Bên cho thuê có trách nhiệm thông báo giá mới cho Bên thuê biết trước khi áp dụng 01 tháng.</p>

                    <h6 className="section-title">Điều 3. Thời điểm giao nhận và thời hạn thuê</h6>
                    <p>1. Thời điểm giao nhận nhà ở: <strong>{formatDateOnly(data.ngayBD)}</strong> là ngày tính tiền thuê nhà.</p>
                    <p>2. Thời hạn thuê: <strong>{tinhSoThangThue(data.ngayBD, ngayKT)}</strong> tháng, kể từ <strong>{formatDateOnly(data.ngayBD)}</strong></p>

                    <h6 className="section-title">Điều 4. Quyền và nghĩa vụ của Bên cho thuê</h6>
                    <p>1. Quyền của Bên cho thuê:</p>
                    <p>a) Yêu cầu Bên thuê sử dụng nhà ở đúng mục đích và đúng nội quy sử dụng nhà ở sinh viên đính kèm hợp đồng thuê nhà ở này; phối hợp với các đơn vị liên quan trong việc xử lý vi phạm quy định về quản lý sử dụng nhà ở;</p>
                    <p>b) Yêu cầu Bên thuê trả tiền thuê nhà đầy đủ và đúng thời hạn ghi trong hợp đồng;</p>
                    <p>c) Yêu cầu Bên thuê có trách nhiệm trả tiền để sửa chữa phần hư hỏng, bồi thường thiệt hại do lỗi của Bên thuê gây ra;</p>
                    <p>d) Được quyền chấm dứt hợp đồng khi có một trong các trường hợp quy định tại Điều 6 của hợp đồng này;</p>
                    <p>đ) Thu hồi nhà ở trong các trường hợp chấm dứt hợp đồng thuê nhà ở theo quy định tại Điều 6 của hợp đồng này.</p>
                    <p>e) Các quyền khác theo thỏa thuận …</p>
                </div>
            </section>

            <section className="contract-page">
                <div className="contract-body">
                    <p>2. Nghĩa vụ của Bên cho thuê</p>
                    <p>a) Giao nhà ở cho Bên thuê đúng thời gian quy định tại Điều 3 của hợp đồng này;</p>
                    <p>b) Xây dựng nội quy sử dụng nhà ở sinh viên và phổ biến quy định về sử dụng nhà ở sinh viên cho Bên thuê và các tổ chức, cá nhân liên quan biết;</p>
                    <p>c) Thực hiện quản lý vận hành, bảo trì nhà ở cho thuê theo quy định;</p>
                    <p>d) Thông báo cho Bên thuê những thay đổi về giá thuê ít nhất là 01 tháng trước khi áp dụng giá mới.</p>
                    <p>đ) Phối hợp với Ban tự quản nhà sinh viên tuyên truyền, đôn đốc sinh viên thuê nhà ở chấp hành nội quy quản lý sử dụng nhà ở sinh viên.</p>
                    <p>e) Các nghĩa vụ khác theo thỏa thuận …</p>

                    <h6 className="section-title">Điều 5. Quyền và nghĩa vụ của Bên thuê</h6>
                    <p>1. Quyền của Bên thuê:</p>
                    <p>a) Nhận nhà ở theo đúng thỏa thuận nêu tại Khoản 1 Điều 3 của hợp đồng này;</p>
                    <p>b) Yêu cầu Bên cho thuê sửa chữa kịp thời những hư hỏng của nhà ở và cung cấp dịch vụ thiết yếu theo thỏa thuận;</p>
                    <p>c) Chấm dứt hợp đồng khi không còn nhu cầu thuê mua nhà ở;</p>
                    <p>d) Thành lập Ban tự quản nhà ở sinh viên;</p>
                    <p>đ) Các quyền khác theo thỏa thuận …</p>
                    <p>2. Nghĩa vụ của Bên thuê:</p>
                    <p>a) Trả đủ tiền thuê nhà theo đúng thời hạn đã cam kết;</p>
                    <p>b) Sử dụng nhà đúng mục đích; giữ gìn nhà ở, có trách nhiệm sửa chữa những hư hỏng và bồi thường thiệt hại do lỗi của mình gây ra;</p>
                    <p>c) Không được tự ý sửa chữa, cải tạo nhà ở thuê; chấp hành đầy đủ những quy định về quản lý sử dụng nhà ở và các quyết định của cơ quan có thẩm quyền về quản lý nhà ở;</p>
                </div>
            </section>

            <section className="contract-page">
                <div className="contract-body">
                    <p>d) Không được chuyển nhượng hợp đồng thuê nhà hoặc cho người khác cùng sử dụng nhà ở dưới bất kỳ hình thức nào;</p>
                    <p>đ) Chấp hành các quy định về nghiêm cấm trong sử dụng nhà ở và giữ gìn vệ sinh môi trường và an ninh trật tự trong khu vực cư trú;</p>
                    <p>e) Giao lại nhà cho Bên cho thuê trong các trường hợp chấm dứt hợp đồng quy định tại Điều 6 của hợp đồng này hoặc trong trường hợp nhà ở thuê thuộc diện bị thu hồi.</p>
                    <p>g) Các nghĩa vụ khác theo thỏa thuận …</p>

                    <h6 className="section-title">Điều 6. Chấm dứt hợp đồng thuê nhà ở sinh viên</h6>
                    <p>Việc chấm dứt hợp đồng thuê nhà ở sinh viên thực hiện trong các trường hợp sau:</p>
                    <p>1. Khi hai bên cùng nhất trí chấm dứt hợp đồng thuê nhà ở;</p>
                    <p>2. Khi Bên thuê không còn thuộc đối tượng được thuê nhà ở hoặc khi Bên thuê nhà chết;</p>
                    <p>3. Khi Bên thuê không trả tiền thuê nhà liên tục trong ba tháng mà không có lý do chính đáng;</p>
                    <p>4. Khi Bên thuê tự ý sửa chữa, đục phá kết cấu, cải tạo hoặc cơi nới nhà ở thuê;</p>
                    <p>5. Khi Bên thuê tự ý chuyển quyền thuê cho người khác hoặc cho người khác cùng sử dụng nhà ở;</p>
                    <p>6. Khi Bên thuê vi phạm các Điều cấm theo quy định;</p>
                    <p>7. Khi nhà ở cho thuê bị hư hỏng nặng có nguy cơ sập đổ hoặc nằm trong khu vực đã có quyết định thu hồi đất, giải phóng mặt bằng hoặc có quyết định phá dỡ của cơ quan nhà nước có thẩm quyền;</p>
                    <p>8. Khi một trong các bên đơn phương chấm dứt hợp đồng theo thỏa thuận (nếu có) hoặc theo quy định pháp luật.</p>

                    <h6 className="section-title">Điều 7. Cam kết thực hiện và giải quyết tranh chấp</h6>
                    <p>1. Các bên cam kết thực hiện đầy đủ các nội dung đã ghi trong hợp đồng này.</p>
                    <p>2. Mọi tranh chấp liên quan hoặc phát sinh từ hợp đồng này sẽ được bàn bạc giải quyết trên tinh thần thương lượng, hoà giải giữa hai bên. Trường hợp không hòa giải được thì đưa ra Tòa án để giải quyết.</p>
                </div>
            </section>

            <section className="contract-page">
                <div className="contract-body">
                    <h6 className="section-title">Điều 8. Điều khoản thi hành</h6>
                    <p>Hợp đồng này có hiệu lực kể từ ngày ký. Hợp đồng này có ….trang, được lập thành 03 bản có giá trị như nhau, mỗi Bên giữ 01 bản, 01 bản lưu tại cơ sở giáo dục nơi sinh viên đang học tập để cùng theo dõi, quản lý./.</p>
                </div>
                <div className="contract-sign">
                    <div className="sign-left">
                        <div className="title">BÊN THUÊ</div>
                        <div className="note">(ký và ghi rõ họ tên)</div>
                        <div className="sign-space"></div>
                        <div className="name"><strong>{N(nguoiThue.hoTen)}</strong></div>
                    </div>
                    <div className="sign-right">
                        <div className="title">BÊN CHO THUÊ</div>
                        <div className="note">(ký tên, ghi rõ họ tên, chức vụ và đóng dấu)</div>
                        <div className="sign-space"></div>
                        <div className="name"><strong>{N(nguoiChoThue.hoTen)}</strong></div>
                    </div>
                </div>
                <div>
                    <div className="contract-body">
                    <div className="mt-4 my-4">________________</div>
                    <p>1 Ghi tên các giấy tờ có liên quan đến việc thuê nhà ở sinh viên...</p>
                    <p>2 Nếu là sinh viên năm đầu mới nhập học chưa có thẻ sinh viên thì ghi thay thế giấy báo trúng tuyển của cơ sở giáo dục</p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default ContractPreview;