import React from 'react';

function Menu(props) {

    const menuItems = [
        {
            label: 'Notify', 
            items: ['Browser Push']
        },
        {
            label: 'Other',
            items: ['Clock']
        }
    ];

    function handleChange(e) {
        props.onMenuChange(e.target.text);
    }

    return (
        <aside className='menu'>
            {menuItems.map((label) => 
                <div key={label.label}>
                    <p className='menu-label'>
                        {label.label}
                    </p>
                    <ul className='menu-list'>
                        {label.items.map((item) => 
                            <li key={item}>
                                <a onClick={handleChange} className={(props.selected == item)?'is-active has-background-dark':''}>
                                    {item}
                                </a>
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </aside>
    );
}

export default Menu;