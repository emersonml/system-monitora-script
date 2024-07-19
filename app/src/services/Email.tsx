import nodemailer from 'nodemailer';

import ApiError from '@utils/ApiError';
import { EMAIL_DEFAULT_FROM, EMAIL_HOST, EMAIL_PASSWORD, EMAIL_PORT, EMAIL_SSL, EMAIL_USER } from '@utils/Environment';

type Data = {
    email: string;
    name: string;
    password: string;
};

export default class ServiceEmail {
    static async recoverPassword({ email, name, password }: Data) {
        try {
            const transporter = nodemailer.createTransport({
                host: EMAIL_HOST,
                port: EMAIL_PORT,
                secure: EMAIL_SSL,
                auth: {
                    user: EMAIL_USER,
                    pass: EMAIL_PASSWORD
                },
                tls: { rejectUnauthorized: false }
            });

            await transporter.sendMail({
                from: `"Nova senha" <${EMAIL_DEFAULT_FROM}>`,
                to: email,
                subject: 'Sua nova senha do sistema',
                text: 'Nova Senha para o sistema',
                html: `
                    <div style="padding: 30px;">
                        <div style="margin-bottom: 30px;">
                            <h2>Polícia Civil de Alagoas</h2>
                            <h4 style="margin-top: -15px;">Sistema</h4>
                        </div>

                        <h3 style="color: #a88133; font-weight: bold; margin: 40px 0;">Olá, ${name}</h3>

                        <p style="font-size: 16px;">
                            Recebemos sua solicitação de senha.
                            Ao acessar o Sistema <span style="color: red">altere a senha</span> por questão de segurança.
                        </p>

                        <p style="font-size: 18px; font-weight: bold;">
                            Sua nova senha é <span style="color: #a88133">${password}</span>
                        </p>

                        <p style="font-size: 16px; font-weight: bold;">
                            Seu email de acesso é <span style="color: #a88133">${email}</span>
                        </p>
                    </div>
                `
            });
        } catch (error) {
            console.error(error);
            throw new ApiError(
                'Ocorreu um erro no enviou do e-mail de recuperação de senha, tente novamente mais tarde',
                400
            );
        }
    }
}
