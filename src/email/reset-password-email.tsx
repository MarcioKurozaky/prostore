import {
  Html,
  Head,
  Preview,
  Tailwind,
  Body,
  Container,
  Heading,
  Section,
  Text,
  Button,
} from "@react-email/components";

interface ResetPasswordEmailProps {
  userName: string;
  resetUrl: string;
}

export default function ResetPasswordEmail({
  userName,
  resetUrl,
}: ResetPasswordEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Recupere sua conta com um clique</Preview>
      <Tailwind>
        <Body className="bg-[#f4f4f5] font-sans">
          <Container className="max-w-xl mx-auto bg-white rounded-xl p-6 shadow-md">
            <Heading className="text-2xl font-bold text-gray-900">
              Olá {userName || "usuário"},
            </Heading>

            <Text className="mt-3 text-base text-gray-700 leading-relaxed">
              Recebemos uma solicitação para redefinir sua senha. Para
              continuar, clique no botão abaixo. Se não foi você quem solicitou,
              ignore este e-mail com segurança.
            </Text>

            <Section className="my-6 text-center">
              <Button
                href={resetUrl}
                className="bg-blue-600 hover:bg-blue-700 transition text-white font-semibold text-base px-6 py-3 rounded-lg"
              >
                Redefinir senha
              </Button>
            </Section>

            <Text className="text-xs text-gray-500 mt-6 text-center">
              Este link expira em 1 hora. Se você tiver problemas, entre em
              contato com o suporte.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
