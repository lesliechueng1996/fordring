import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { FormEventHandler } from 'react';
import useToast from '../hooks/useToast';

function LoginPage() {
  const { warn } = useToast();

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const email = e.currentTarget.email.value;
    const password = e.currentTarget.password.value;
    if (!email) {
      warn('请输入邮箱');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      warn('请输入正确的邮箱');
      return;
    }
    if (!password) {
      warn('请输入密码');
      return;
    }
  };

  return (
    <div className="w-screen h-screen bg-[url('/images/background.jpg')] bg-center bg-no-repeat bg-cover flex justify-end">
      <div className="w-1/2 h-full flex flex-col justify-center items-center">
        <div className="w-1/2 bg-white/70 p-10 rounded-md flex flex-col items-center gap-8">
          <h1 className="text-white">Fordring Blog</h1>
          <form className="space-y-8 w-full" onSubmit={onSubmit}>
            <div>
              <span className="p-float-label">
                <InputText id="email" name="email" className="w-full text-lg" />
                <label htmlFor="email">邮箱</label>
              </span>
            </div>
            <div>
              <span className="p-float-label">
                <Password
                  id="password"
                  name="password"
                  className="w-full"
                  inputClassName="w-full text-lg"
                  toggleMask
                  promptLabel="请输入密码"
                  weakLabel="弱"
                  mediumLabel="中"
                  strongLabel="强"
                />
                <label htmlFor="password">密码</label>
              </span>
            </div>
            <div>
              <Button label="登录" className="w-full" type="submit" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
