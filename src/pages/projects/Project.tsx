import { useState } from 'react';
import PortfolioHeader from '../../features/portfolio/PortfolioHeader';
import FilterTabs from '../../features/portfolio/FilterTabs';
import ProjectGrid from '../../features/portfolio/ProjectGrid';


const Portfolio = () => {
    const [filter, setFilter] = useState<'All' | 'Enterprise' | 'Engineering'>('All');

    return (
        <div className="min-h-screen bg-stone-50 pt-24 pb-20 w-full">
            <PortfolioHeader />
            <FilterTabs filter={filter} setFilter={setFilter} />
            <ProjectGrid filter={filter} />
        </div>
    );
};

export default Portfolio;