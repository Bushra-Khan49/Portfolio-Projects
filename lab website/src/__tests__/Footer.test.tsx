import { render, screen } from '@testing-library/react';
import Footer from '@/components/Footer';

describe('Footer Component', () => {
    it('renders the lab name', () => {
        render(<Footer />);
        expect(screen.getByText(/Nexus Genomics Institute/i)).toBeInTheDocument();
    });

    it('contains privacy and terms links', () => {
        render(<Footer />);
        expect(screen.getByText(/Privacy Policy/i)).toBeInTheDocument();
        expect(screen.getByText(/Terms of Use/i)).toBeInTheDocument();
    });
});
