import { PatientQueue } from '../types/patient-queues';
import { trimVisitNumber } from '../helpers/functions';

function readTicketNumber(queue: PatientQueue) {
  let utterance = new SpeechSynthesisUtterance();
  utterance.text = `Ticket number ${trimVisitNumber(queue.visitNumber).split('').join(' ')} move to ${
    queue.locationTo.name
  }`;
  utterance.voice = window.speechSynthesis.getVoices()[0];
  utterance.rate = 0.5;
  window.speechSynthesis.speak(utterance);
}

async function readTickets(queues: PatientQueue[]) {
  for (const index in queues) {
    const queue = queues[index];
    if (queue.locationTo?.name) {
      readTicketNumber(queue);
      await wait(2000);
    }
  }
}

function wait(time: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}
