function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

const TextScramble = function() {
    class TextScramble {
        constructor(el) {
            _classCallCheck(this, TextScramble);

            this.el = el;
            this.chars = '!<>-_\\/[]{}—=+*^?#________';
            this.update = this.update.bind(this);
        }

        setText(newText) {
            let _this = this,
                oldText = this.el.innerText,
                length = Math.max(oldText.length, newText.length);

            let promise = new Promise(function (resolve) {
                return _this.resolve = resolve;
            });

            this.queue = [];

            for(let i = 0; i < length; i++) {
                let from = oldText[i] || '',
                    to = newText[i] || '',
                    start = Math.floor(Math.random() * 40),
                    end = start + Math.floor(Math.random() * 40);

                this.queue.push({from, to, start, end});
            }

            cancelAnimationFrame(this.frameRequest);
            this.frame = 0;
            this.update();
            return promise;
        }

        randomChar() {
            return this.chars[Math.floor(Math.random() * this.chars.length)];
        }
    }


    TextScramble.prototype.update = function update() {
        let output = '', complete = 0;

        for (let i = 0, n = this.queue.length; i < n; i++) {
            let _queue$i = this.queue[i],
                from = _queue$i.from,
                to = _queue$i.to,
                start = _queue$i.start,
                end = _queue$i.end,
                char = _queue$i.char;

            if (this.frame >= end) {
                complete++;
                output += to;
            } else if(this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }

                output += '<span class="dud">' + char + '</span>';
            } else output += from;
        }

        this.el.innerHTML = output;

        if (complete === this.queue.length) this.resolve();
        else {
            this.frameRequest=requestAnimationFrame(this.update);
            this.frame++;
        }
    }; 
    
    return TextScramble;
}();

let phrases = ['fiWe', 'Welcome to my GitHub page'],
    el = document.querySelector('.text'),
    fx = new TextScramble(el),
    counter = 0;

const next = () => {
    fx.setText(phrases[counter]).then(() => setTimeout(next, 3000));

    counter = (counter + 1) % phrases.length;
};

next();