
import Layout from '@/components/layout/Layout';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

const Terms = () => {
  return (
    <Layout>
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Điều khoản sử dụng</h1>
          <p className="text-muted-foreground mb-8">
            Cập nhật lần cuối: 01/05/2023
          </p>
          
          <Separator className="mb-8" />
          
          <ScrollArea className="h-auto">
            <div className="space-y-8">
              <section className="space-y-4">
                <h2 className="text-xl font-semibold">1. Giới thiệu</h2>
                <p>
                  Chào mừng bạn đến với TopMarketingJobs (sau đây gọi là "Chúng tôi", "Website", hoặc "Nền tảng"). 
                  Khi bạn sử dụng dịch vụ của chúng tôi, bạn đồng ý tuân thủ các điều khoản sử dụng này. 
                  Vui lòng đọc kỹ trước khi sử dụng.
                </p>
                <p>
                  TopMarketingJobs là nền tảng kết nối nhà tuyển dụng và ứng viên trong lĩnh vực Marketing.
                  Chúng tôi cung cấp các dịch vụ bao gồm nhưng không giới hạn ở đăng tin tuyển dụng, tìm kiếm việc làm,
                  quản lý hồ sơ ứng viên và nhà tuyển dụng.
                </p>
              </section>
              
              <section className="space-y-4">
                <h2 className="text-xl font-semibold">2. Tài khoản người dùng</h2>
                <p>
                  Để sử dụng đầy đủ các tính năng của nền tảng, bạn cần tạo một tài khoản. Khi tạo tài khoản, bạn phải cung cấp 
                  thông tin chính xác và cập nhật. Bạn chịu trách nhiệm bảo mật tài khoản của mình, bao gồm mật khẩu và bất kỳ
                  hoạt động nào diễn ra dưới tài khoản của bạn.
                </p>
                <p>
                  Chúng tôi có quyền từ chối dịch vụ, đóng tài khoản, xóa hoặc chỉnh sửa nội dung, hoặc hủy đơn hàng 
                  theo quyết định riêng của chúng tôi.
                </p>
              </section>
              
              <section className="space-y-4">
                <h2 className="text-xl font-semibold">3. Quyền và trách nhiệm của người dùng</h2>
                <h3 className="text-lg font-medium">3.1. Nhà tuyển dụng</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Cung cấp thông tin chính xác và đầy đủ về công ty, vị trí tuyển dụng và yêu cầu công việc.
                  </li>
                  <li>
                    Không đăng các thông tin sai lệch, gây hiểu nhầm hoặc vi phạm pháp luật Việt Nam.
                  </li>
                  <li>
                    Chịu trách nhiệm về nội dung, hình ảnh và thông tin trong tin tuyển dụng.
                  </li>
                  <li>
                    Tuân thủ các quy định về bảo vệ dữ liệu cá nhân khi xử lý thông tin ứng viên.
                  </li>
                </ul>
                
                <h3 className="text-lg font-medium">3.2. Ứng viên</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Cung cấp thông tin chính xác và trung thực trong hồ sơ cá nhân.
                  </li>
                  <li>
                    Không chia sẻ thông tin cá nhân nhạy cảm không liên quan đến mục đích tìm việc.
                  </li>
                  <li>
                    Không sử dụng nền tảng cho mục đích lừa đảo, spam hoặc hoạt động bất hợp pháp.
                  </li>
                  <li>
                    Tôn trọng quyền sở hữu trí tuệ và không sao chép, phân phối nội dung trái phép.
                  </li>
                </ul>
              </section>
              
              <section className="space-y-4">
                <h2 className="text-xl font-semibold">4. Chính sách thanh toán và hoàn tiền</h2>
                <p>
                  TopMarketingJobs cung cấp các gói dịch vụ có phí dành cho nhà tuyển dụng. Khi mua các gói dịch vụ, 
                  bạn đồng ý với điều khoản thanh toán và không hoàn tiền như sau:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Các gói dịch vụ đã kích hoạt không được hoàn tiền, trừ trường hợp có lỗi từ phía chúng tôi.
                  </li>
                  <li>
                    Thanh toán được thực hiện trước khi dịch vụ được kích hoạt hoặc gia hạn.
                  </li>
                  <li>
                    Chúng tôi có thể thay đổi giá cả sau khi thông báo trước 30 ngày.
                  </li>
                </ul>
              </section>
              
              <section className="space-y-4">
                <h2 className="text-xl font-semibold">5. Sở hữu trí tuệ</h2>
                <p>
                  Tất cả nội dung trên nền tảng TopMarketingJobs, bao gồm nhưng không giới hạn ở văn bản, đồ họa, 
                  logo, biểu tượng, hình ảnh, clip âm thanh, tải xuống kỹ thuật số, và tổng hợp dữ liệu là tài sản 
                  của TopMarketingJobs hoặc bên cấp phép và được bảo vệ bởi luật sở hữu trí tuệ Việt Nam và quốc tế.
                </p>
              </section>
              
              <section className="space-y-4">
                <h2 className="text-xl font-semibold">6. Giới hạn trách nhiệm</h2>
                <p>
                  TopMarketingJobs không đảm bảo rằng dịch vụ của chúng tôi sẽ không bị gián đoạn, kịp thời, an toàn 
                  hoặc không có lỗi. Chúng tôi không chịu trách nhiệm về việc nội dung đăng tải bởi người dùng hoặc 
                  bên thứ ba vi phạm quyền sở hữu trí tuệ, quyền riêng tư, hoặc các quy định pháp luật.
                </p>
                <p>
                  Trong mọi trường hợp, TopMarketingJobs sẽ không chịu trách nhiệm đối với bất kỳ thiệt hại nào phát 
                  sinh từ việc sử dụng hoặc không thể sử dụng dịch vụ của chúng tôi.
                </p>
              </section>
              
              <section className="space-y-4">
                <h2 className="text-xl font-semibold">7. Thay đổi điều khoản</h2>
                <p>
                  Chúng tôi có quyền cập nhật, thay đổi hoặc thay thế bất kỳ phần nào của Điều khoản này bằng cách đăng 
                  cập nhật lên trang web của chúng tôi. Trách nhiệm của bạn là kiểm tra trang web của chúng tôi định kỳ 
                  để biết các thay đổi. Việc bạn tiếp tục sử dụng hoặc truy cập vào trang web sau khi đăng bất kỳ thay 
                  đổi nào đối với Điều khoản này đồng nghĩa với việc bạn chấp nhận những thay đổi đó.
                </p>
              </section>
              
              <section className="space-y-4">
                <h2 className="text-xl font-semibold">8. Liên hệ</h2>
                <p>
                  Mọi thắc mắc về Điều khoản sử dụng này, vui lòng liên hệ với chúng tôi qua:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Email: contact@topmarketingjobs.vn</li>
                  <li>Điện thoại: 0708684608</li>
                  <li>Địa chỉ: Landmark 81, Quận Bình Thạnh, TP. Hồ Chí Minh</li>
                </ul>
              </section>
            </div>
          </ScrollArea>
        </div>
      </div>
    </Layout>
  );
};

export default Terms;
