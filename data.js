const itemsData = [
    { "icon": "fa-solid fa-person", "label": " A Person" },
    { "icon": "fa-solid fa-dog", "label": " A Dog" },
    { "icon": "fa-solid fa-chess-queen", "label": " The Queen" },
    { "icon": "fa-solid fa-microscope", "label": " A Scientist that will Discover the cure to cancer" },
    { "icon": "fa-solid fa-baby-carriage", "label": " A Baby" },
    { "icon": "fa-solid fa-skull-crossbones", "label": " A Murderer that will kill your mother in the future" },
    { "icon": "fa-solid fa-virus-covid", "label": " A container that seals a deadly virus that will be released if broken" },
    { "icon": "fa-solid fa-person-military-pointing", "label": " An evil dictator in his prime" },
    { "icon": "fa-solid fa-sack-dollar", "label": " Your Life Savings" },
    { "icon": "fa-solid fa-bed", "label": " Someone that's asleep and wont feel the pain" },
    { "icon": "fa-solid fa-bomb", "label": " A Terrorist" },
    { "icon": "fa-solid fa-hand-fist", "label": " Your High School Bully" },
];

document.addEventListener('DOMContentLoaded', () => {
    const itemsContainer = document.getElementById('items-container');

    itemsData.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('item');
        itemElement.draggable = true;
        itemElement.dataset.label = item.label;
        itemElement.innerHTML = `<i class="${item.icon}"></i><span>${item.label}</span>`;
        itemElement.addEventListener('dragstart', dragStart);
        itemsContainer.appendChild(itemElement);
    });
});
