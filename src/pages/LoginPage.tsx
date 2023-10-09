import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { FormEventHandler } from 'react';
import useToast from '../hooks/useToast';
import { retrieveToken, USER_NOT_FOUND, USER_DISABLE, INVALID_PASSWORD, LOCK_USER } from '../apis/auth-api';
import type { GenerateTokenRes } from '../apis/auth-api';
import { API_OK } from '../apis/http-request';
import useAuth from '../hooks/useAuth';

function LoginPage() {
  const { warn, error } = useToast();
  const { setTokenStore } = useAuth();

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
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

    const res: ApiJsonResult<unknown> = await retrieveToken(email, password);
    if (res.code === API_OK) {
      const tokenStore = res.data as GenerateTokenRes;
      setTokenStore(tokenStore);
    } else if (res.code === USER_NOT_FOUND) {
      error('用户不存在');
    } else if (res.code === USER_DISABLE) {
      error('用户已锁定');
    } else if (res.code === INVALID_PASSWORD) {
      const { count } = res.data as { count: number };
      error(`密码错误，还有${count}次机会`);
    } else if (res.code === LOCK_USER) {
      error('密码错误，用户已锁定');
    } else {
      error(res.message);
    }
  };

  return (
    <div className="w-screen h-screen bg-[url('/images/background.jpg')] bg-center bg-no-repeat bg-cover flex justify-end">
      <div className="w-1/2 h-full flex flex-col justify-center items-center">
        <div className="w-1/2 max-w-lg bg-white/70 p-10 rounded-md flex flex-col items-center gap-8">
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
                  feedback={false}
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
