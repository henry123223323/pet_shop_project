import React, { Component } from 'react';

class Pagination extends Component {
    render() {
        const { totalItems, itemsPerPage, currentPage, onPageChange } = this.props;
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        if (totalPages <= 1) return null;

        const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

        return (
            <div className="flex gap-2 justify-center mt-4">
                <button
                    className="px-3 py-1 rounded border "
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                >
                    上一頁
                </button>

                {pageNumbers.map((page) => (
                    <button
                        key={page}
                        className={`px-3 py-1 rounded border ${page === currentPage ? 'bg-gray-300' : ''}`}
                        onClick={() => onPageChange(page)}
                    >
                        {page}
                    </button>
                ))}

                <button
                    className="px-3 py-1 rounded border"
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                >
                    下一頁
                </button>
            </div>
        );
    }
}

export default Pagination;

