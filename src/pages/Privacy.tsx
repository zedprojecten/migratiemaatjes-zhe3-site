import { Link } from "react-router-dom";

export default function Privacy() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-16 prose prose-neutral prose-invert">
      <h1 className="text-3xl font-semibold mb-6">Privacyverklaring</h1>
      <p className="mb-4">
        Op deze website gebruiken we Google Analytics 4 om bij te houden hoe bezoekers de site
        gebruiken. Dit gebeurt alleen als je daarvoor toestemming hebt gegeven via de
        cookie-banner. We gebruiken Google Analytics 4 met Consent Mode v2: cookies worden alleen gezet als je
        akkoord gaat in de cookie-banner. Google past automatisch IP-truncation toe op de
        verzamelde data. We delen geen persoonsgegevens met derden voor advertentiedoeleinden.
      </p>
      <p className="mb-4">
        We bewaren geanonimiseerde gebruiksdata maximaal 14 maanden. Je kunt je toestemming
        intrekken door de cookies van deze site te verwijderen via je browser-instellingen.
      </p>
      <p className="mb-4">
        Vragen over je privacy? Mail naar het contactadres in de footer.
      </p>
      <p className="mt-8">
        <Link to="/" viewTransition className="text-primary hover:text-primary/80 hover:underline">
          ← Terug naar de homepage
        </Link>
      </p>
    </main>
  );
}
