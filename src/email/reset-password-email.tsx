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
      <Preview>Redefina sua senha</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="max-w-xl p-6">
            <Heading className="text-xl font-bold">
              Olá {userName || "usuário"},
            </Heading>
            <Text className="mt-4 text-gray-700">
              Clique no botão abaixo para redefinir sua senha:
            </Text>
            <Section className="my-6 text-center">
              <Button
                href={resetUrl}
                className="bg-blue-600 text-white px-5 py-3 rounded-md"
              >
                Redefinir senha
              </Button>
            </Section>
            <Text className="text-sm text-gray-600">
              Caso você não tenha solicitado, ignore este e-mail.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
