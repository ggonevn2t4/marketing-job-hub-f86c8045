
import Layout from '@/components/layout/Layout';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

const Privacy = () => {
  return (
    <Layout>
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Chính sách bảo mật</h1>
          <p className="text-muted-foreground mb-8">
            Cập nhật lần cuối: 01/05/2023
          </p>
          
          <Separator className="mb-8" />
          
          <ScrollArea className="h-auto">
            <div className="space-y-8">
              <section className="space-y-4">
                <h2 className="text-xl font-semibold">1. Giới thiệu</h2>
                <p>
                  TopMarketingJobs ("chúng tôi", "của chúng tôi") cam kết bảo vệ quyền riêng tư của bạn. Chính sách bảo mật 
                  này mô tả cách chúng tôi thu thập, sử dụng và chia sẻ thông tin cá nhân của bạn khi bạn sử dụng nền tảng 
                  TopMarketingJobs.
                </p>
                <p>
                  Bằng việc sử dụng dịch vụ của chúng tôi, bạn đồng ý với việc thu thập và sử dụng thông tin theo chính sách này.
                </p>
              </section>
              
              <section className="space-y-4">
                <h2 className="text-xl font-semibold">2. Thông tin chúng tôi thu thập</h2>
                <p>
                  Chúng tôi thu thập các loại thông tin sau:
                </p>
                <h3 className="text-lg font-medium">2.1. Thông tin bạn cung cấp cho chúng tôi</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Thông tin tài khoản:</strong> Khi bạn đăng ký, chúng tôi thu thập tên, email, số điện thoại và mật khẩu.
                  </li>
                  <li>
                    <strong>Thông tin hồ sơ:</strong> Đối với ứng viên, chúng tôi thu thập thông tin về học vấn, kinh nghiệm làm việc, kỹ năng, và thông tin liên hệ.
                  </li>
                  <li>
                    <strong>Thông tin công ty:</strong> Đối với nhà tuyển dụng, chúng tôi thu thập thông tin về công ty, ngành nghề, quy mô và thông tin liên hệ.
                  </li>
                  <li>
                    <strong>Thông tin thanh toán:</strong> Khi bạn mua dịch vụ, chúng tôi thu thập thông tin thanh toán cần thiết.
                  </li>
                </ul>
                
                <h3 className="text-lg font-medium">2.2. Thông tin tự động thu thập</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Dữ liệu sử dụng:</strong> Chúng tôi thu thập thông tin về cách bạn tương tác với nền tảng, như các trang bạn truy cập, thời gian truy cập và các hành động bạn thực hiện.
                  </li>
                  <li>
                    <strong>Thông tin thiết bị:</strong> Chúng tôi thu thập thông tin về thiết bị bạn sử dụng để truy cập dịch vụ, bao gồm mẫu phần cứng, hệ điều hành, trình duyệt web và địa chỉ IP.
                  </li>
                  <li>
                    <strong>Cookie và công nghệ tương tự:</strong> Chúng tôi sử dụng cookie và các công nghệ tương tự để thu thập thông tin về hoạt động duyệt web của bạn.
                  </li>
                </ul>
              </section>
              
              <section className="space-y-4">
                <h2 className="text-xl font-semibold">3. Cách chúng tôi sử dụng thông tin</h2>
                <p>
                  Chúng tôi sử dụng thông tin thu thập được để:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Cung cấp, duy trì và cải thiện dịch vụ của chúng tôi</li>
                  <li>Xử lý giao dịch và gửi thông báo liên quan</li>
                  <li>Kết nối ứng viên với nhà tuyển dụng phù hợp</li>
                  <li>Gửi thông tin cập nhật, thông báo kỹ thuật, thông báo bảo mật và tin nhắn hỗ trợ</li>
                  <li>Phản hồi các yêu cầu, câu hỏi và phản hồi của bạn</li>
                  <li>Phát hiện, ngăn chặn và giải quyết các hoạt động gian lận, trái phép hoặc bất hợp pháp</li>
                  <li>Tuân thủ nghĩa vụ pháp lý</li>
                </ul>
              </section>
              
              <section className="space-y-4">
                <h2 className="text-xl font-semibold">4. Cách chúng tôi chia sẻ thông tin</h2>
                <p>
                  Chúng tôi có thể chia sẻ thông tin cá nhân của bạn trong các trường hợp sau:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Với nhà tuyển dụng:</strong> Nếu bạn là ứng viên, hồ sơ công khai của bạn có thể được 
                    xem bởi nhà tuyển dụng sử dụng nền tảng của chúng tôi.
                  </li>
                  <li>
                    <strong>Với ứng viên:</strong> Nếu bạn là nhà tuyển dụng, thông tin công ty và tin tuyển dụng 
                    của bạn sẽ được hiển thị cho ứng viên.
                  </li>
                  <li>
                    <strong>Với nhà cung cấp dịch vụ:</strong> Chúng tôi có thể chia sẻ thông tin với các bên thứ ba 
                    cung cấp dịch vụ thay mặt chúng tôi, như xử lý thanh toán, phân tích dữ liệu, gửi email, lưu trữ 
                    đám mây, và dịch vụ khách hàng.
                  </li>
                  <li>
                    <strong>Tuân thủ pháp luật:</strong> Chúng tôi có thể tiết lộ thông tin nếu chúng tôi tin rằng 
                    việc tiết lộ đó là cần thiết để tuân thủ luật pháp, quy định, quy trình pháp lý hoặc yêu cầu 
                    chính phủ.
                  </li>
                  <li>
                    <strong>Bảo vệ quyền:</strong> Chúng tôi có thể tiết lộ thông tin để bảo vệ quyền, tài sản hoặc 
                    an toàn của chúng tôi, người dùng của chúng tôi hoặc công chúng.
                  </li>
                </ul>
              </section>
              
              <section className="space-y-4">
                <h2 className="text-xl font-semibold">5. Bảo mật dữ liệu</h2>
                <p>
                  Chúng tôi thực hiện các biện pháp bảo mật hợp lý để bảo vệ thông tin cá nhân của bạn khỏi việc mất mát, 
                  truy cập, sử dụng, sửa đổi và tiết lộ trái phép. Tuy nhiên, không có phương thức truyền dẫn qua internet 
                  hoặc phương thức lưu trữ điện tử nào là an toàn 100%.
                </p>
              </section>
              
              <section className="space-y-4">
                <h2 className="text-xl font-semibold">6. Quyền của bạn</h2>
                <p>
                  Tùy thuộc vào luật pháp địa phương của bạn, bạn có thể có các quyền sau liên quan đến dữ liệu cá nhân của mình:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Quyền truy cập thông tin cá nhân của bạn</li>
                  <li>Quyền chỉnh sửa hoặc cập nhật thông tin cá nhân của bạn</li>
                  <li>Quyền xóa thông tin cá nhân của bạn</li>
                  <li>Quyền hạn chế xử lý thông tin cá nhân của bạn</li>
                  <li>Quyền phản đối việc xử lý thông tin cá nhân của bạn</li>
                  <li>Quyền di chuyển dữ liệu</li>
                </ul>
                <p>
                  Để thực hiện bất kỳ quyền nào trong số này, vui lòng liên hệ với chúng tôi theo thông tin liên hệ được 
                  cung cấp dưới đây.
                </p>
              </section>
              
              <section className="space-y-4">
                <h2 className="text-xl font-semibold">7. Thay đổi chính sách bảo mật</h2>
                <p>
                  Chúng tôi có thể cập nhật Chính sách Bảo mật này tại bất kỳ thời điểm nào bằng cách đăng phiên bản cập nhật 
                  lên trang web của chúng tôi. Bạn nên kiểm tra trang này định kỳ để biết mọi thay đổi.
                </p>
              </section>
              
              <section className="space-y-4">
                <h2 className="text-xl font-semibold">8. Liên hệ</h2>
                <p>
                  Nếu bạn có bất kỳ câu hỏi nào về Chính sách Bảo mật này, vui lòng liên hệ với chúng tôi:
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

export default Privacy;
