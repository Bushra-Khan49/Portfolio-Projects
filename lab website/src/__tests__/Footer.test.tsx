import { render, screen } from '@testing-library/react';
import Footer from '@/components/Footer';

describe('Footer Component', () => {
    it('renders the lab name', () => {
        render(<Footer />);
        expect(screen.getAllByText(/Nexus Genomics Institute/i).length).toBeGreaterThan(0);
    });

    it('contains privacy and terms links', () => {
        render(<Footer />);
        expect(screen.getByText(/Privacy Policy/i)).toBeInTheDocument();
        expect(screen.getByText(/Terms of Use/i)).toBeInTheDocument();
    });
});
