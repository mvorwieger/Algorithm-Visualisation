# Algorithm Visualiser

This is a Project to demonstrate how the new `Proxy` class in Javascript might be used to visualise the sorting of a array.
Proxies have the functionality to set a `callback` on when a array/object gets modified and lets
us access the values. For further information see: 
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy  

![alt text](./algorithm-visualiser.gif)

## What does it do?

In code you wouldnt need to change the implementation of your particular sort Algorithm as we just
create a Proxied array that logs every change made to the array.

```javascript
// Generic implementation of bubbleSort and selectionSort
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

// create a 'proxied' array that notices when mutations to the array are done.
const proxiedArray1 = createVisualisableArray(randomArray1, visualiser);
const proxiedArray2 = createVisualisableArray(randomArray2, visualiser2);

bubbleSort(proxiedArray1);
selectionSort(proxiedArray2);
```
In `createVisualisableArray` we use a Proxy to log any mutations of the array
`visualiser.saveImage` creates a image(copy) of the array when it get mutated
and later uses these 'images' to visualise the sorting
```js
function createVisualisableArray(arr, visualiser) {
    return new Proxy(arr, {
        set: (obj, key, value) => {
            visualiser.saveImage(obj);
            obj[key] = value;
        }
    })
}
```
