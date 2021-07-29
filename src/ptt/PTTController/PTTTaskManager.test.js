// import { PTTTaskManager } from './PTTTaskManager.js'

// describe('PTT PTTTaskManager', () => {
//   beforeEach(() => {
//     PTTTaskManager.reset()
//   })
//   it('null list', () => {
//     expect(PTTTaskManager.taskList.length).toBe(0)
//     expect(PTTTaskManager.lock).toBe(false)
//   })
//   it('add one task', () => {
//     const task = PTTTaskManager.addTask('Task' + 1)
//     expect(PTTTaskManager.taskList.length).toBe(0)
//     expect(PTTTaskManager.lock).toBe(true)
//     expect(task).toBe('Task1')
//   })
//   it('finish one task', () => {
//     let task = PTTTaskManager.addTask('Task' + 1)
//     expect(PTTTaskManager.taskList.length).toBe(0)
//     expect(PTTTaskManager.lock).toBe(true)
//     expect(task).toBe('Task1')

//     task = PTTTaskManager.next()
//     expect(PTTTaskManager.taskList.length).toBe(0)
//     expect(PTTTaskManager.lock).toBe(false)
//     expect(task).toBeNull()
//   })
//   it('finish one task twice', () => {
//     let task = PTTTaskManager.addTask('Task' + 1)
//     expect(PTTTaskManager.taskList.length).toBe(0)
//     expect(PTTTaskManager.lock).toBe(true)
//     expect(task).toBe('Task1')

//     task = PTTTaskManager.next()
//     expect(PTTTaskManager.taskList.length).toBe(0)
//     expect(PTTTaskManager.lock).toBe(false)
//     expect(task).toBeNull()

//     task = PTTTaskManager.addTask('Task' + 2)
//     expect(PTTTaskManager.taskList.length).toBe(0)
//     expect(PTTTaskManager.lock).toBe(true)
//     expect(task).toBe('Task2')

//     task = PTTTaskManager.next()
//     expect(PTTTaskManager.taskList.length).toBe(0)
//     expect(PTTTaskManager.lock).toBe(false)
//     expect(task).toBeNull()
//   })

//   it('finish two task', () => {
//     let task = PTTTaskManager.addTask('Task' + 1)
//     expect(PTTTaskManager.taskList.length).toBe(0)
//     expect(PTTTaskManager.lock).toBe(true)
//     expect(task).toBe('Task1')

//     task = PTTTaskManager.addTask('Task' + 2)
//     expect(PTTTaskManager.taskList.length).toBe(1)
//     expect(PTTTaskManager.lock).toBe(true)
//     expect(task).toBeNull()

//     task = PTTTaskManager.next()
//     expect(PTTTaskManager.taskList.length).toBe(0)
//     expect(PTTTaskManager.lock).toBe(true)
//     expect(task).toBe('Task2')

//     task = PTTTaskManager.next()
//     expect(PTTTaskManager.taskList.length).toBe(0)
//     expect(PTTTaskManager.lock).toBe(false)
//     expect(task).toBeNull()
//   })
//   it('finish 20 task', () => {
//     let taskcount = -1

//     for (let i = 1; i <= 20; i++) {
//       taskcount += 1
//       const task = PTTTaskManager.addTask('Task' + i)
//       if (taskcount > 0) {
//         expect(task).toBeNull()
//       } else {
//         expect(task).toBe('Task' + i)
//       }
//       expect(PTTTaskManager.lock).toBe(true)
//       expect(PTTTaskManager.taskList.length).toBe(i - 1)
//     }
//     for (let i = 1; i <= 20; i++) {
//       taskcount -= 1
//       const task = PTTTaskManager.next()
//       if (taskcount > -1) {
//         expect(task).toBe('Task' + (i + 1))
//         expect(PTTTaskManager.lock).toBe(true)
//       } else {
//         expect(task).toBeNull()
//         expect(PTTTaskManager.lock).toBe(false)
//       }
//       expect(PTTTaskManager.taskList.length).toBe(Math.max(0, 20 - i - 1))
//     }
//   })
//   it('finish random times task with random sort', () => {
//     let taskcount = -1
//     Math.random()
//     let addedTask = 0
//     let nowTask = 0
//     for (let i = 0; i < Math.random() * 1000; i++) {
//       if (Math.random() < 0.5) {
//         addedTask += 1
//         taskcount += 1
//         const task = PTTTaskManager.addTask('Task' + addedTask)

//         if (taskcount > 0) {
//           expect(task).toBeNull()
//         } else {
//           nowTask++
//           expect(task).toBe('Task' + nowTask)
//         }
//       } else {
//         const task = PTTTaskManager.next()
//         taskcount -= 1
//         if (taskcount > -1) {
//           nowTask++
//           expect(task).toBe('Task' + nowTask)
//         } else {
//           expect(task).toBeNull()
//         }
//       }
//       if (taskcount > 0) {
//         expect(PTTTaskManager.taskList.length).toBe(taskcount)
//       } else {
//         expect(PTTTaskManager.taskList.length).toBe(0)
//       }
//       if (taskcount > -1) {
//         expect(PTTTaskManager.lock).toBe(true)
//       } else {
//         expect(PTTTaskManager.lock).toBe(false)
//       }
//       if (taskcount < -1) taskcount = -1
//     }
//   })
// })
