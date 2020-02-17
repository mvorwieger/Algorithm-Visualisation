class Visualiser {
    constructor(canvasElement, intervalTime = 20, barPadding = 5) {
        this.context = canvasElement.getContext("2d");
        this.height = canvasElement.height;
        this.width = canvasElement.width;
        // the images hold all the values of each iteration that the array provides
        this.images = [];
        this.intervalTime = intervalTime;
        this.barPadding = barPadding;
    }

    saveImage(arr) {
        this.images.push([...arr]);
    }

    draw() {
        let counter = 0;
        let interval = setInterval(() => {
            this.clear();
            const currentImage = this.images[counter];
            const barWidth = this.width / currentImage.length - this.barPadding;
            const highestValue = Math.max(...currentImage);
            const barHeightUnitMultiplicator = this.height / highestValue;
            const sortedIndex = Visualiser.isSortedTillIndex(currentImage);

            currentImage.forEach((current, index) => {
                const x = (index * barWidth) + (index * this.barPadding);
                const y = this.height;
                const strokeWidth = barWidth;
                const strokeHeight = current * barHeightUnitMultiplicator;
                this.drawRect(x, y, strokeWidth, -strokeHeight, sortedIndex > index ? "green" : "black");
            });

            counter++;

            if (counter >= this.images.length) {
                clearInterval(interval);
            }
        }, this.intervalTime)
    }

    static isSortedTillIndex(arr) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] > arr[i + 1]) {
                return i;
            }
        }

        return arr.length;
    }

    clear() {
        this.context.clearRect(0, 0, this.width, this.height);
    }

    drawRect(x, y, width, height, color = "#000") {
        this.context.fillStyle = color;
        this.context.fillRect(x, y, width, height);
    }
}

function createVisualisableArray(arr, visualiser) {
    return new Proxy(arr, createHandler(arr => visualiser.saveImage(arr)))
}

function bubbleSort(arr) {
    var len = arr.length;
    for (var i = len - 1; i >= 0; i--) {
        for (var j = 1; j <= i; j++) {
            if (arr[j - 1] > arr[j]) {
                var temp = arr[j - 1];
                arr[j - 1] = arr[j];
                arr[j] = temp;
            }
        }
    }
    return arr;
}

function selectionSort(arr) {
    var minIdx, temp,
        len = arr.length;
    for (var i = 0; i < len; i++) {
        minIdx = i;
        for (var j = i + 1; j < len; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }

        temp = arr[i];
        arr[i] = arr[minIdx];
        arr[minIdx] = temp;
    }
    return arr;
}

const canvas = document.querySelector(".graph1");
const canvas2 = document.querySelector(".graph2");

const visualiser = new Visualiser(canvas);
const visualiser2 = new Visualiser(canvas2);

const range = (start, stop, step = 1) =>
    Array(Math.ceil((stop - start) / step))
        .fill(start)
        .map((x, y) => x + y * step);

const shuffle = array => array.sort(() => Math.random() - 0.5);

const createHandler = (callback) => ({
    set: function (obj, prop, value) {
        callback(obj, prop, value);
        obj[prop] = value;
    }
});

const randomArray1 = shuffle(range(1, 50));
const randomArray2 = [...randomArray1];

const proxiedArray1 = createVisualisableArray(randomArray1, visualiser);
const proxiedArray2 = createVisualisableArray(randomArray2, visualiser2);

bubbleSort(proxiedArray1);
selectionSort(proxiedArray2);

visualiser.draw();
visualiser2.draw();
