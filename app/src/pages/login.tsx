import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { Button, Form, Input, notification } from 'antd';
import GoogleReCaptcha from 'react-google-recaptcha';
import { AiOutlineUser } from 'react-icons/ai';
import { FiLock } from 'react-icons/fi';
import styled from 'styled-components';

import InputEmail from '@components/Form/InputEmail';
import EnvironmentApi from '@services/Api/EnvironmentApi';
import SessionApi from '@services/Api/SessionApi';
import UserApi from '@services/Api/UserApi';
import useLoadingState from '@states/LoadingState';
import useTranslationState from '@states/TranslationState';
import { TOKEN_KEY } from '@utils/Constant';
import { EMAIL_HOST, RECAPTCHA_SITE_KEY } from '@utils/Environment';
import Storage from '@utils/Storage';

type FormData = {
    username: string;
    password: string;
    email: string;
};

export default function LoginPage() {
    const loadingState = useLoadingState();
    const { translation } = useTranslationState();

    const [reCaptchaVerified, setReCaptchaVerified] = useState(!RECAPTCHA_SITE_KEY);
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [loginAttempts, setLoginAttempts] = useState(0);
    const [capsLockOn, setCapsLockOn] = useState(false);

    const router = useRouter();
    const environment = EnvironmentApi.get();

    async function handleLogin(data: FormData) {
        try {
            if (!reCaptchaVerified) return;

            await loadingState.show();

            const { token } = await SessionApi.login(data);

            Storage.set(TOKEN_KEY, token);
            router.push('/');
        } catch (error) {
            notification.error({
                message: translation(error.message)
            });

            const loginSumAttempts = loginAttempts + 1;
            setLoginAttempts(loginSumAttempts);

            if (loginSumAttempts > 1 && loginSumAttempts != 5) {
                notification.warn({
                    message: `Você só possuí (${5 - loginSumAttempts}) tentativas!`
                });
            }

            loadingState.hide();
        }
    }

    async function handleRecover(data: FormData) {
        try {
            if (!reCaptchaVerified) return;

            await loadingState.show();

            await UserApi.recoverPassword(data.email);

            notification.success({
                message: translation('Email de redefinição de senha enviado')
            });

            toggleLoginMode();
        } catch (error) {
            notification.error({
                message: translation(error.message)
            });
        } finally {
            loadingState.hide();
        }
    }

    function handleRecaptcha(token: string) {
        setReCaptchaVerified(!!token);
    }

    function toggleLoginMode() {
        setIsLoginMode(!isLoginMode);
    }

    const validationAttemptsLogin: boolean = isLoginMode ? loginAttempts === 5 : false;

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            const capsLockIsOn: boolean = e?.getModifierState ? e?.getModifierState('CapsLock') : false;
            setCapsLockOn(capsLockIsOn);
        };

        document?.addEventListener('keydown', handleKeyPress);
        return () => {
            document?.removeEventListener('keydown', handleKeyPress);
        };
    }, []);

    return (
        <>
            <Head>
                <title>{environment.data?.title}</title>
                <link rel="icon" href={environment.data?.favicon} />

                <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
            </Head>

            <Container $backgroundImage="/images/login/bg_login.jpg">
                <Content>
                    <img className="logo" src="/images/login/logo.png" alt="" />

                    <Form layout="inline" onFinish={isLoginMode ? handleLogin : handleRecover}>
                        <h2>{isLoginMode ? translation('Login') : translation('Redefinir senha')}</h2>

                        {isLoginMode ? (
                            <div>
                                {loginAttempts === 5 ? (
                                    <h4>Você errou 5 vezes seu login/senha tente recuperar</h4>
                                ) : (
                                    <>
                                        <Form.Item name="email" rules={[{ required: true }]}>
                                            <Input
                                                prefix={<AiOutlineUser size={16} />}
                                                placeholder={translation('Usuário / E-mail')}
                                                size="large"
                                            />
                                        </Form.Item>

                                        <Form.Item name="password" rules={[{ required: true }]}>
                                            <Input.Password
                                                prefix={<FiLock size={16} />}
                                                placeholder={translation('Senha')}
                                                size="large"
                                            />
                                        </Form.Item>
                                    </>
                                )}
                            </div>
                        ) : (
                            <InputEmail name="email" size="large" required custom />
                        )}

                        {capsLockOn && <h5>Caps Lock está ligado.</h5>}
                        {RECAPTCHA_SITE_KEY && <ReCaptcha sitekey={RECAPTCHA_SITE_KEY} onChange={handleRecaptcha} />}

                        <ButtonsContainer>
                            <Button
                                type="primary"
                                htmlType="submit"
                                disabled={!reCaptchaVerified || validationAttemptsLogin}>
                                {isLoginMode ? translation('Entrar') : translation('Enviar')}
                            </Button>

                            {EMAIL_HOST && (
                                <Button type="link" onClick={toggleLoginMode}>
                                    {isLoginMode ? translation('Esqueceu a senha?') : translation('Voltar ao login')}
                                </Button>
                            )}
                        </ButtonsContainer>
                    </Form>
                </Content>
            </Container>
        </>
    );
}

const Container = styled.div<{ $backgroundImage: string }>`
    display: flex;
    flex-direction: column;
    align-items: left;
    justify-content: center;

    height: 100%;
    width: 100%;

    background-image: url('${props => props.$backgroundImage}');
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
`;

const Content = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    gap: 12px;
    overflow: hidden;

    width: 70%;
    height: 100%;

    background: linear-gradient(104deg, rgb(1, 23, 46) 20%, rgb(8, 8, 8, 0) 70%);

    h4 {
        font-weight: normal;
        color: #d1d2d4;
    }

    h5 {
        font-weight: normal;
        font-size: 10pt;
        color: #ff4d4f;
        margin-top: 4px;
        text-align: center;
    }

    form {
        display: flex;
        flex-direction: column;

        padding: 28px 16px;
        border-radius: 8px;

        border: 2px solid #5e6b7b;
        background-color: #020e1a;

        h2 {
            margin-bottom: 10px;
            font-weight: normal;
            color: #d1d2d4;
        }

        .ant-form-item {
            margin: 0;
        }

        .ant-form-item + .ant-form-item {
            margin-top: 10px;
        }
    }

    .logo {
        width: 200px;
        height: 100px;

        margin-bottom: 16px;
    }

    .banner {
        width: 48%;
        max-width: 500px;
        height: 36px;

        cursor: pointer;
        margin-top: 16px;

        img {
            width: 100%;
            max-width: 500px;
            height: 36px;
        }
    }

    @media (max-width: 750px) {
        width: 100%;
        min-width: auto;
        padding: 16px;

        .banner {
            width: 100%;
        }

        form {
            width: 100%;
            padding: 0 16px 24px;

            h2 {
                margin-bottom: 16px;
            }
        }
    }

    @media (max-width: 430px) {
        form {
            padding: 0 8px 24px;
        }
    }
`;

const ReCaptcha = styled(GoogleReCaptcha)`
    margin-top: 10px;
`;

const ButtonsContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;

    margin-top: 16px;

    .ant-btn-link {
        color: #d1d2d4 !important;
    }

    @media (max-width: 750px) {
        button {
            height: 38px;
        }
    }
`;
