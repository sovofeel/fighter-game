const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576

ctx.fillRect(0, 0, canvas.width, canvas.height)

	const gravity = 0.7

	class Sprite {
	 constructor({position, velocity, color = "red", width, offset}) {
		 this.position = position
		 this.velocity = velocity
		 this.width = width
		 this.height = 150
		 this.lastKey
		 this.color = color    
		 this.attackBox = {
			 position: {
				 x: this.position.x,
				 y: this.position.y,
			 },
			 offset: offset,
			 width: 100,
			 height: 50
		 }
		 this.isAttacking
	 }

	 draw() {
			ctx.fillStyle = this.color
		 	ctx.fillRect(this.position.x, this.position.y, this.width, this.height)

			if (this.isAttacking) {
				ctx.fillStyle = 'green'
				ctx.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
			}
	 }

	 update() {
		
		 this.draw()
		 this.attackBox.position.x = this.position.x - this.attackBox.offset.x
		 this.attackBox.position.y = this.position.y - this.attackBox.offset.y
		 this.position.x += this.velocity.x 
		 this.position.y += this.velocity.y

		 if(this.position.y + this.height + this.velocity.y >= canvas.height) {
			 this.velocity.y = 0
		 } else {
				this.velocity.y += gravity
		 }
	 }

	 attack() {
		 this.isAttacking = true
		 console.log('attack');
		 setTimeout(() => {
			 this.isAttacking = false
		 }, 100)
	 }
 }

 const player = new Sprite({
	width: 50,
	position: {
	 x: 0,
	 y: 0,
 },
 velocity: {
	 x: 0,
	 y: 10
 },
 offset: {
	 x: 0, y: 0
 },
 color: 'red'
})

 const enemy = new Sprite({
	width: 50,
	 position: { 
		x: 400,
		y: 0,
	},
	offset: {
		x: 50, y: 0
	},
	velocity: {   
		x: 0,
		y: 0
	},
	color: 'blue'
})

const keys = {
	a: {
		pressed: false,
	},
	d: {
		pressed: false,
	},
	ArrowLeft: {
		pressed: false,
	},
	ArrowRight: {
		pressed: false,
	}
}

function rectengularCollision({rectangle1, rectangle2}) {
	return (
		rectangle1.attackBox.position.x + rectangle1.attackBox.width >= enemy.position.x && 
		rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.attackBox.width && 
		rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y && 
		rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height 
	)
}

function animate() {
	window.requestAnimationFrame(animate)
	ctx.fillStyle = 'black'
	ctx.fillRect(0, 0, canvas.width, canvas.height)
	player.update()
	enemy.update()
	player.velocity.x = 0
	enemy.velocity.x = 0

	if (keys.a.pressed && player.lastKey === 'a') {
		player.velocity.x = -5
	} else if (keys.d.pressed && player.lastKey === 'd') {
		player.velocity.x = 5
	}

	if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
		enemy.velocity.x = -5
	} else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
		enemy.velocity.x = 5
	}

	if (
		rectengularCollision({
			rectangle1: player,
			rectangle2: enemy
		}) && player.isAttacking
		) {
			console.log('p1 attack');
			player.isAttacking = false
	}


	if (
		rectengularCollision({
			rectangle1:enemy,
			rectangle2: player
		}) && enemy.isAttacking
		) {
			console.log('p2 attack');
			enemy.isAttacking = false
	}
}

animate()



window.addEventListener('keydown', (event) => {
	
	switch(event.key) {
		case 'd':
			keys.d.pressed = true
			player.lastKey = 'd'
			break
		case 'a':
			keys.a.pressed = true
			player.lastKey = 'a'
			break
		case 'w':
			player.velocity.y = -20
			break
		case ' ':
			player.attack()
			break

	}


	switch(event.key) {
		case 'ArrowLeft':
			keys.ArrowLeft.pressed = true
			enemy.lastKey = 'ArrowLeft'
			break
		case 'ArrowRight':
			keys.ArrowRight.pressed = true
			enemy.lastKey = 'ArrowRight'
			break
		case 'ArrowUp': 
			enemy.velocity.y = -20
			break
		case 'ArrowDown':
			enemy.attack()
			break
	}
	

})


window.addEventListener('keyup', (event) => {
	switch(event.key) {
		case 'd':
			keys.d.pressed = false
			break
		case 'a':
			keys.a.pressed = false
			break
	}

	switch(event.key) {
		case 'ArrowLeft':
			keys.ArrowLeft.pressed = false
			break
		case 'ArrowRight':
			keys.ArrowRight.pressed = false
			break
	}
})