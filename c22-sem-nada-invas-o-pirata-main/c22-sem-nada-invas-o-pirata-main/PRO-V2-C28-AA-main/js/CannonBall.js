class CannonBall {
    constructor(x, y) {
        var opitons = {
            isStatic: true
        }

        this.r = 30
        this.speed = 0.05
        this.image = loadImage("./assets/cannonball.png")
        this.animation = [this.image]
        this.isSink = false
        this.trajectore = []
        this.body = Bodies.circle(x, y, this.r, opitons)
        World.add(world, this.body)


    }

    animate() {
        this.speed += 0.05
    }

    remove(index) {
        this.isSink = true
        Matter.Body.setVelocity(this.body, { x: 0, y: 0 })


        if (balls[index].body.position.x >= width) {
            this.animation = waterAnimation
            this.speed = 0.05
            this.r = 150
            delete balls[index]

        } else {
            this.animation = waterAnimation
            this.speed = 0.05
            this.r = 150
            setTimeout(() => {
                Matter.World.remove(world, this.body)
                delete balls[index]
            }, 1000);
        }


    }

    shoot() {
        var newAngle = cannon.angle - 28
        newAngle = newAngle * (3.14 / 180)

        var velocity = p5.Vector.fromAngle(newAngle)
        velocity.mult(0.5)
        Matter.Body.setStatic(this.body, false)
        Matter.Body.setVelocity(this.body, { x: velocity.x * (180 / 3.14), y: velocity.y * (180 / 3.14) })
    }

    display() {
        var pos = this.body.position
        var angle=this.body.angle
        var index=floor(this.speed%this.animation.length)
        if (this.body.velocity.x > 0 && pos.x > 300&& !this.isSink) {
            var position = [pos.x, pos.y]
            this.trajectore.push(position)
        }
            for (var i = 0; i < this.trajectore.length; i++) {
                image(this.image, this.trajectore[i][0], this.trajectore[i][1], 5, 5)
            }
        

        push()
        imageMode(CENTER)
        translate(pos.x,pos.y)
        rotate(angle)
        image(this.animation[index], 0, 0, this.r, this.r)
        pop()

    }
}